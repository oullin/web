class ApiClient
{
	private readonly apiKey: string;
	private readonly apiUsername: string;
	private readonly apiSignature: string;
	private readonly basedURL: string;

	constructor(options: ApiClientOptions) {
		this.apiKey = options.apiKey;
		this.basedURL = options.basedURL;
		this.apiUsername = options.apiUsername;
		this.apiSignature = options.apiSignature;
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

	public async get<T>(url: string, options?: RequestInit): Promise<T> {
		const headers = this.createHeaders();

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: headers,
				...options, // Merge any additional fetch options
			});

			if (!response.ok) {
				const errorBody = await response.text();
				throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
			}

			return await response.json() as Promise<T>;

		} catch (error) {
			throw error instanceof Error ? error : new Error(`An unexpected error occurred: ${String(error)}`);
		}
	}
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
