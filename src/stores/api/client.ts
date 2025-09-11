import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '@api/http-error.ts';
import { SignatureResponse } from '@api/response/signature-response.ts';

const ENV_PROD = 'production';

export const defaultCreds: ApiClientOptions = {
	env: import.meta.env.VITE_API_ENV as string,
	apiKey: import.meta.env.VITE_PUBLIC_KEY as string,
	apiUsername: import.meta.env.VITE_ACCOUNT_NAME as string,
};

export interface ApiClientOptions {
	env: string;
	apiKey: string;
	apiUsername: string;
}

export interface CacheEntry<T> {
	etag: string;
	data: T;
}

export interface ApiResponse<T> {
	version: string;
	data: T;
}

export class ApiClient {
	private readonly env: string;
	private readonly apiKey: string;
	private readonly hostURL: string;
	private readonly basedURL: string;
	private readonly apiUsername: string;

	constructor(options: ApiClientOptions) {
		this.env = options.env;
		this.apiKey = options.apiKey;
		this.apiUsername = options.apiUsername;
		this.hostURL = `${import.meta.env.VITE_HOST_URL}`;
		this.basedURL = `${import.meta.env.VITE_API_URL}`;
	}

	public createNonce(): string {
		return crypto.getRandomValues(new Uint8Array(16)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '');
	}

	private getCacheKey(url: string): string {
		return `api-cache-${url}`;
	}

	private getFromCache<T>(url: string): CacheEntry<T> | null {
		const key = this.getCacheKey(url);
		const item = localStorage.getItem(key);

		return item ? JSON.parse(item) : null;
	}

	private setToCache<T>(url: string, etag: string, data: T): void {
		const key = this.getCacheKey(url);
		const item: CacheEntry<T> = { etag, data };

		localStorage.setItem(key, JSON.stringify(item));
	}

	public isProd(): boolean {
		return this.env.trim().toLowerCase() === ENV_PROD;
	}

	public isDev(): boolean {
		return !this.isProd();
	}

	private getCurrentTimestamp(): number {
		return Math.floor(Date.now() / 1000);
	}

	private createHeaders(): Headers {
		const headers = new Headers();

		headers.append('X-API-Key', this.apiKey);
		headers.append('X-Request-ID', uuidv4());
		headers.append('User-Agent', 'oullin/web-app');
		headers.append('X-API-Username', this.apiUsername);
		headers.append('Content-Type', 'application/json');
		headers.append('X-API-Timestamp', this.getCurrentTimestamp().toString());

		return headers;
	}

	private async getSignature(nonce: string, origin: string): Promise<SignatureResponse> {
		const headers = this.createHeaders();
		// @todo Add comments here on the `why` of using `rely`
		const fullUrl = new URL('relay/generate-signature', this.hostURL);

		if (this.isProd() && fullUrl.protocol !== 'https:') {
			throw new Error('Signature endpoint must be accessed over HTTPS.');
		}

		headers.append('X-API-Intended-Origin', origin);

		const response = await fetch(fullUrl.href, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				nonce: nonce,
				public_key: this.apiKey,
				username: this.apiUsername,
				timestamp: this.getCurrentTimestamp(),
			}),
		});

		if (!response.ok) {
			throw new HttpError(response, await response.text());
		}

		return await response.json();
	}

	private async appendSignature(nonce: string, headers: Headers, origin: string) {
		const retries = 3;
		let lastError: Error | undefined;

		for (let i = 0; i < retries; i++) {
			try {
				const sigResp = await this.getSignature(nonce, origin);

				headers.append('X-API-Nonce', nonce);
				headers.append('X-API-Intended-Origin', origin);
				headers.append('X-API-Signature', sigResp.signature);

				return;
			} catch (error) {
				lastError = error as Error;

				if (i < retries - 1) {
					// Exponential backoff: waits 1 s, then 2 s.
					await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
				}
			}
		}

		throw lastError || new Error('Failed to get signature after multiple retries.');
	}

	public async post<T>(url: string, data: object): Promise<T> {
		const nonce = this.createNonce();
		const headers = this.createHeaders();
		const fullUrl = new URL(url, this.basedURL);

		await this.appendSignature(nonce, headers, fullUrl.href);

		const response = await fetch(fullUrl.href, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new HttpError(response, await response.text());
		}

		return await response.json();
	}

	public async get<T>(url: string): Promise<T> {
		const nonce = this.createNonce();
		const headers = this.createHeaders();
		const cached = this.getFromCache<T>(url);
		const fullUrl = new URL(url, this.basedURL);

		if (cached) {
			headers.append('If-None-Match', cached.etag);
		}

		await this.appendSignature(nonce, headers, fullUrl.href);

		const response = await fetch(fullUrl.href, {
			method: 'GET',
			headers: headers,
		});

		if (response.status === 304) {
			console.log(`%c[CACHE] 304 Not Modified for "${url}". Serving from cache.`, 'color: #007acc;');

			// We can safely assert cached is not null here.
			return cached!.data;
		}

		if (!response.ok) {
			throw new HttpError(response, await response.text());
		}

		const eTag = response.headers.get('ETag');
		const payload = await response.json();

		if (eTag) {
			this.setToCache(url, eTag, payload);
		}

		return payload;
	}
}
