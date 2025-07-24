import { parseError } from '@stores/api/http-error.ts';
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
		return parseError(error);
	}
}
