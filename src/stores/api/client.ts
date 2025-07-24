import { HttpError } from '@stores/api/http-error.ts';

export interface ApiClientOptions {
	apiKey: string;
	apiUsername: string;
	apiSignature: string;
}

export interface ApiResponse<T> {
	version: string;
	data: T;
}

export const Credentials = (): ApiClientOptions => ({
	apiKey: import.meta.env.VITE_PUBLIC_KEY as string,
	apiUsername: import.meta.env.VITE_ACCOUNT_NAME as string,
	apiSignature: import.meta.env.VITE_PUBLIC_SIGNATURE as string,
});

export class ApiClient {
	private readonly apiKey: string;
	private readonly basedURL: string;
	private readonly apiUsername: string;
	private readonly apiSignature: string;

	constructor(options: ApiClientOptions) {
		this.apiKey = options.apiKey;
		this.apiUsername = options.apiUsername;
		this.apiSignature = options.apiSignature;
		this.basedURL = `${import.meta.env.VITE_API_URL}`;
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
