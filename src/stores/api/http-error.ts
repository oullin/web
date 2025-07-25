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

export function parseError(error: any): Promise<never> {
	let errorMessage = `An unexpected error occurred: ${error}`;

	if (error instanceof HttpError) {
		errorMessage = `An error occurred in the API. status [${error.message}] / message [${error.body}]`;
	}

	return new Promise((resolve, reject) => {
		reject(new Error(errorMessage));
	});
}

export function debugError(error: any): void {
	if (error instanceof HttpError) {
		console.error(`API Error: Status ${error.status}`);
		console.error('Server Response:', error.body);
	} else {
		console.error('An unexpected error occurred:', error);
	}
}
