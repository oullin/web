import { defineStore } from 'pinia';
import { parseError } from '@api/http-error.ts';
import { ProfileResponse } from '@api/response/profile-response.ts';
import { ApiClient, ApiResponse, defaultCreds } from '@api/client.ts';
import type { PostsResponse } from '@api/response/posts-response.ts';

const STORE_KEY = 'api-client-store';

export interface ApiStoreState {
	client: ApiClient;
}

const client = new ApiClient(defaultCreds);

export const useApiStore = defineStore(STORE_KEY, {
	state: (): ApiStoreState => ({
		client: client,
	}),
	actions: {
		boot(): void {
			if (this.client.isDev()) {
				console.log('API client booted ...');
			}
		},
		async getProfile(): Promise<ApiResponse<ProfileResponse>> {
			const url = 'profile';

			try {
				return await this.client.get<ApiResponse<ProfileResponse>>(url);
			} catch (error) {
				return parseError(error);
			}
		},
		async getPosts(): Promise<ApiResponse<PostsResponse>> {
			const url = 'posts';

			try {
				return await this.client.get<ApiResponse<PostsResponse>>(url);
			} catch (error) {
				return parseError(error);
			}
		},
		async getPost(slug: string): Promise<PostsResponse> {
			const url = `posts/${slug}`;

			try {
				return await this.client.get<PostsResponse>(url);
			} catch (error) {
				return parseError(error);
			}
		},
	},
});
