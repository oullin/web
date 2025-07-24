export class HttpError extends Error {
	public readonly body: any;
	public readonly status: number;

	constructor(response: Response, body: any) {
		super(`API request failed with status ${response.status}: ${response.statusText}`);

		this.body = body;
		this.name = 'HttpError';
		this.status = response.status;

		// This line is for compatibility with older environments
		Object.setPrototypeOf(this, HttpError.prototype);
	}
}
