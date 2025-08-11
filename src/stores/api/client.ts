import { HttpError } from '@api/http-error.ts';

const ENV_PROD = 'production';

export const defaultCreds: ApiClientOptions = {
	env: import.meta.env.VITE_API_ENV as string,
	apiKey: import.meta.env.VITE_PUBLIC_KEY as string,
	apiUsername: import.meta.env.VITE_ACCOUNT_NAME as string,
	apiSignature: import.meta.env.VITE_PUBLIC_SIGNATURE as string,
};

export interface ApiClientOptions {
	env: string;
	apiKey: string;
	apiUsername: string;
	apiSignature: string;
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
	private readonly apiSignature: string;
	private readonly nonce: string;
	private readonly timestamp: string;

	constructor(options: ApiClientOptions) {
		this.env = options.env;
		this.nonce = this.getNonce();
		this.apiKey = options.apiKey;
		this.apiUsername = options.apiUsername;
		this.apiSignature = options.apiSignature;
		this.basedURL = `${import.meta.env.VITE_API_URL}`;
		this.timestamp = Math.floor(Date.now() / 1000).toString();
	}

	private getNonce(): string {
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
		headers.append('X-API-Nonce', this.nonce);
		headers.append('X-Request-ID', this.nonce);
		headers.append('User-Agent', 'oullin/web-app');
		headers.append('X-API-Timestamp', this.timestamp);
		headers.append('X-API-Username', this.apiUsername);
		headers.append('Content-Type', 'application/json');

		return headers;
	}

	private async sha256Hex(text: string): Promise<string> {
		const enc = new TextEncoder();

		const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));

		return Array.from(new Uint8Array(buf))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	private async hmacSha256Hex(secret: string, message: string): Promise<string> {
		const enc = new TextEncoder();
		const key = await crypto.subtle.importKey(
			'raw',
			enc.encode(secret),
			{
				name: 'HMAC',
				hash: 'SHA-256',
			},
			false,
			['sign'],
		);

		const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));

		return Array.from(new Uint8Array(sig))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	public async post<T>(url: string, data: object): Promise<T> {
		const headers = this.createHeaders();
		const fullUrl = new URL(url, this.basedURL);

		const content: string = JSON.stringify(data);
		const signature = await this.getSignature('POST', fullUrl, content);

		headers.append('X-API-Signature', signature);

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

	private sortedQuery(u: string): string {
		const params = new URL(u).searchParams;

		params.sort();
		return params.toString();
	}

	private async getSignature(method: string, uri: URL, body: string): Promise<string> {
		const content = await this.sha256Hex(body);

		const canonical = [method.toUpperCase(), uri.pathname || '/', this.sortedQuery(uri.href), this.apiUsername, this.apiKey, this.timestamp, this.nonce, content].join('\n');

		return await this.hmacSha256Hex(this.apiKey, canonical);
	}

	public async get<T>(url: string): Promise<T> {
		const headers = this.createHeaders();
		const cached = this.getFromCache<T>(url);
		const fullUrl = new URL(url, this.basedURL);

		if (cached) {
			headers.append('If-None-Match', cached.etag);
		}

		const signature = await this.getSignature('GET', fullUrl, '');
		headers.append('X-API-Signature', signature);

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
