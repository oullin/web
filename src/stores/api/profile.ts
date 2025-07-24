import { HttpError } from '@stores/api/http-error.ts';
import { ApiClient, ApiResponse, Credentials } from '@stores/api/client.ts';

interface UserProfile {
	nickname: string;
	handle: string;
	name: string;
	email: string;
	profession: string;
}

export async function useProfile(): Promise<ApiResponse<UserProfile>> {
	const apiClient = new ApiClient(Credentials());

	try {
		return await apiClient.get<ApiResponse<UserProfile>>('profile');
	} catch (error) {
		let errorMessage = `An unexpected error occurred: ${error}`;

		if (error instanceof HttpError) {
			errorMessage = `An error occurred in the API. status [${error.message}] / message [${error.body}]`;
		}

		return new Promise((resolve, reject) => {
			reject(new Error(errorMessage));
		});
	}
}
