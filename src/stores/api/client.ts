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
	private readonly basedURL: string;
	private readonly apiUsername: string;
	private readonly timestamp: number;

	constructor(options: ApiClientOptions) {
		this.env = options.env;
		this.apiKey = options.apiKey;
		this.apiUsername = options.apiUsername;
		this.basedURL = `${import.meta.env.VITE_API_URL}`;
		this.timestamp = Math.floor(Date.now() / 1000);
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

	private createHeaders(): Headers {
		const headers = new Headers();

		headers.append('X-API-Key', this.apiKey);
		headers.append('X-Request-ID', uuidv4());
		headers.append('User-Agent', 'oullin/web-app');
		headers.append('X-API-Timestamp', this.timestamp.toString());
		headers.append('X-API-Username', this.apiUsername);
		headers.append('Content-Type', 'application/json');

		return headers;
	}

	private async getSignature(nonce: string, origin: string): Promise<SignatureResponse> {
		const headers = this.createHeaders();
		const fullUrl = new URL('generate-signature', this.basedURL);

		headers.append('X-API-Intended-Origin', origin);

		const response = await fetch(fullUrl.href, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				nonce: nonce,
				public_key: this.apiKey,
				username: this.apiUsername,
				timestamp: this.timestamp,
			}),
		});

		if (!response.ok) {
			throw new HttpError(response, await response.text());
		}

		return await response.json();
	}

	private async appendSignature(nonce: string, headers: Headers, origin: string) {
		const sigResp = await this.getSignature(nonce, origin);

		headers.append('X-API-Nonce', nonce);
		headers.append('X-API-Intended-Origin', origin);
		headers.append('X-API-Signature', sigResp.signature);
	}

	public async post<T>(url: string, nonce: string, data: object): Promise<T> {
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

	public async get<T>(url: string, nonce: string): Promise<T> {
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
