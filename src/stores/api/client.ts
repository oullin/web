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

	constructor(options: ApiClientOptions) {
		this.env = options.env;
		this.apiKey = options.apiKey;
		this.apiUsername = options.apiUsername;
		this.apiSignature = options.apiSignature;
		this.basedURL = `${import.meta.env.VITE_API_URL}`;
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
		headers.append('User-Agent', 'oullin/web-app');
		headers.append('X-API-Username', this.apiUsername);
		headers.append('X-API-Signature', this.apiSignature);

		headers.append('Content-Type', 'application/json');

		return headers;
	}

	public async get<T>(url: string): Promise<T> {
		const headers = this.createHeaders();
		const fullUrl = new URL(url, this.basedURL);

		const response = await fetch(fullUrl.href, {
			method: 'GET',
			headers: headers,
		});

		if (response.ok) {
			return (await response.json()) as Promise<T>;
		}

		throw new HttpError(response, await response.text());
	}
}
