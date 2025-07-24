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

interface UserProfile {
	nickname: string;
	handle: string;
	name: string;
	email: string;
	profession: string;
}
