import { v4 as uuidv4 } from 'uuid';
import { HttpError } from '@api/http-error.ts';
import { SignatureResponse } from '@api/response/signature-response.ts';

const ENV_PROD = 'production';
const MAX_LATENCY_FOR_SYNC_MS = 1000; // Ignore sync if RTT is > 1s (unreliable)
const MAX_CACHE_AGE_MS = 60_000; // Ignore the Date header if older than 1 min (stale cache)

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

	// Default to 0, updated dynamically via server responses
	private clockOffsetMs = 0;

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

	/**
	 * Returns the current UNIX timestamp (seconds) adjusted by the
	 * calculated server offset.
	 */
	private getCurrentTimestamp(): number {
		return Math.floor((Date.now() + this.clockOffsetMs) / 1000);
	}

	/**
	 * Updates the X-API-Timestamp header immediately before dispatch.
	 * Critical for minimising the gap between signing and sending.
	 */
	private refreshTimestamp(headers: Headers): void {
		headers.set('X-API-Timestamp', this.getCurrentTimestamp().toString());
	}

	private createHeaders(timestamp?: number): Headers {
		const headers = new Headers();
		const ts = timestamp ?? this.getCurrentTimestamp();

		headers.append('X-API-Key', this.apiKey);
		headers.append('X-Request-ID', uuidv4());
		headers.append('User-Agent', 'oullin/web-app');
		headers.append('X-API-Username', this.apiUsername);
		headers.append('Content-Type', 'application/json');
		headers.append('X-API-Timestamp', ts.toString());

		return headers;
	}

	/**
	 * Synchronises the local clock with server time using Cristian's Algorithm.
	 * 1. Calculates Round Trip Time (RTT).
	 * 2. Adjusts server time by RTT/2 to account for latency.
	 * 3. Ignores high-latency or stale responses to prevent jitter/errors.
	 */
	private syncClockOffset(response: Response, requestStartTime: number): void {
		const now = Date.now();
		const rtt = now - requestStartTime;
		const isClockSkewResponse = response.status === 401;

		// 1. Safety: If the request took too long, the latency variance is too high for accurate sync.
		if (rtt > MAX_LATENCY_FOR_SYNC_MS) {
			return;
		}

		const dateHeader = response.headers.get('Date');

		if (!dateHeader) {
			return;
		}

		const serverTime = Date.parse(dateHeader);
		if (Number.isNaN(serverTime)) {
			return;
		}

		// 2. Safety: Detect Stale Cache.
		// If the server date is significantly in the past, we hit a cached response (e.g., CDN).
		// Using this would break our clock.
		if (!isClockSkewResponse && Math.abs(now - serverTime) > MAX_CACHE_AGE_MS) {
			return;
		}

		// 3. Calculation: Corrected Time = Server Header Time + (RTT / 2)
		const correctedServerTime = serverTime + rtt / 2;

		this.clockOffsetMs = correctedServerTime - now;
	}

	private async getSignature(nonce: string, origin: string): Promise<SignatureResponse> {
		const fullUrl = new URL('relay/generate-signature', this.hostURL);

		if (this.isProd() && fullUrl.protocol !== 'https:') {
			throw new Error('Signature endpoint must be accessed over HTTPS.');
		}

		const makeRequest = async () => {
			const timestamp = this.getCurrentTimestamp();
			const headers = this.createHeaders(timestamp);

			headers.append('X-API-Intended-Origin', origin);

			const startTime = Date.now();

			const res = await fetch(fullUrl.href, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					nonce: nonce,
					public_key: this.apiKey,
					username: this.apiUsername,
					timestamp: timestamp,
				}),
			});

			this.syncClockOffset(res, startTime);

			return res;
		};

		let response = await makeRequest();

		// Handle 401 specifically for clock skew (retry once with new offset)
		if (!response.ok && response.status === 401) {
			response = await makeRequest();
		}

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

				// Critical: Update the timestamp to "now" just before sending a request
				this.refreshTimestamp(headers);
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
		this.refreshTimestamp(headers);

		const startTime = Date.now();
		const response = await fetch(fullUrl.href, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(data),
		});

		this.syncClockOffset(response, startTime);

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
		this.refreshTimestamp(headers);

		const startTime = Date.now();
		const response = await fetch(fullUrl.href, {
			method: 'GET',
			headers: headers,
		});

		this.syncClockOffset(response, startTime);

		if (response.status === 304) {
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
