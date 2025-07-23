interface ApiClientOptions {
	basedURL: string;
	apiKey: string;
	apiUsername: string;
	apiSignature: string; // This might be dynamically generated per request in a real scenario
}

interface ApiResponse<T> {
	version: string;
	data: T;
}

class ApiClient {
	private readonly apiKey: string;
	private readonly apiUsername: string;
	private readonly apiSignature: string;
	private readonly userAgent: string;
	private readonly basedURL: string;

	constructor(options: ApiClientOptions) {
		this.apiKey = options.apiKey;
		this.apiUsername = options.apiUsername;
		this.apiSignature = options.apiSignature;
		this.userAgent = 'oullin/web-app';
		this.basedURL = options.basedURL;
	}

	private createHeaders(): Headers {
		const headers = new Headers();

		headers.append('Content-Type', 'application/json');
		headers.append('User-Agent', this.userAgent);
		headers.append('X-API-Key', this.apiKey);
		headers.append('X-API-Username', this.apiUsername);
		headers.append('X-API-Signature', this.apiSignature);

		return headers;
	}

	/**
	 * Performs a GET request to the specified URL.
	 * @template T - The expected type of the JSON response data.
	 * @param {string} url - The full URL to send the GET request to.
	 * @param {RequestInit} [options] - Optional fetch options to merge with the request.
	 * @returns {Promise<T>} A promise that resolves with the JSON response data.
	 * @throws {Error} Throws an error if the network request fails or the API returns a non-2xx status code.
	 */
	public async get<T>(url: string, options?: RequestInit): Promise<T> {
		const headers = this.createHeaders();

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: headers,
				...options, // Merge any additional fetch options
			});

			if (!response.ok) {
				// Attempt to get more detailed error info from the response body
				const errorBody = await response.text();
				throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
			}

			// Assuming the response will always be JSON
			return response.json() as Promise<T>;

		} catch (error) {
			console.error("Failed to execute GET request:", error);
			// Re-throw the error to be handled by the caller
			throw error;
		}
	}
}

// --- Example Usage ---

// 1. Define the expected shape of your API response
interface UserProfile {
	nickname: string;
	handle: string;
	name: string;
	email: string;
	profession: string;
}

// 2. Main function to demonstrate the client
export async function fetchUserProfile() {
	const clientOptions: ApiClientOptions = {
		basedURL: `${import.meta.env.VITE_API_URL}/profile`,
		apiKey: import.meta.env.VITE_PUBLIC_KEY as string,
		apiUsername: import.meta.env.VITE_ACCOUNT_NAME as string,
		apiSignature: import.meta.env.VITE_PUBLIC_SIGNATURE as string,
		// userAgent: 'MyWebApp/1.0.0'
	};

	const apiClient = new ApiClient(clientOptions);
	const requestUrl = clientOptions.basedURL;

	try {
		console.log(`Fetching user profile from ${requestUrl}...`);
		// Specify the expected response type in the angle brackets
		const userProfile = await apiClient.get<ApiResponse<UserProfile>>(requestUrl);

		console.log('Successfully fetched user profile:');
		console.log(userProfile);

	} catch (error) {
		let errorMessage = "An unknown error occurred while fetching the user profile.";

		if (error instanceof Error) {
			// Now we know 'error' is an Error object, so we can safely access 'message'.
			errorMessage = error.message;
		}

		console.error('An error occurred while fetching the user profile:', errorMessage);
	}
}
