import { defineStore } from 'pinia';
import { parseError } from '@api/http-error.ts';
import { ProfileResponse } from '@api/response/profile-response.ts';
import { ApiClient, ApiResponse, defaultCreds } from '@api/client.ts';
import type { PostResponse, PostsCollectionResponse, PostsFilters } from '@api/response/posts-response.ts';
import type { CategoriesCollectionResponse } from '@api/response/categories-response.ts';
import type { ExperienceResponse } from '@api/response/experience-response.ts';

const STORE_KEY = 'api-client-store';

export interface ApiStoreState {
	client: ApiClient;
	searchTerm: string;
}

const client = new ApiClient(defaultCreds);

export const useApiStore = defineStore(STORE_KEY, {
	state: (): ApiStoreState => ({
		client: client,
		searchTerm: '',
	}),
	actions: {
		setSearchTerm(term: string): void {
			this.searchTerm = term;
		},
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
		async getExperience(): Promise<ApiResponse<ExperienceResponse[]>> {
			const url = 'experience';

			try {
				return await this.client.get<ApiResponse<ExperienceResponse[]>>(url);
			} catch (error) {
				return parseError(error);
			}
		},
		async getCategories(): Promise<CategoriesCollectionResponse> {
			const url = 'categories?limit=5';

			try {
				return await this.client.get<CategoriesCollectionResponse>(url);
			} catch (error) {
				return parseError(error);
			}
		},
		async getPosts(filters: PostsFilters): Promise<PostsCollectionResponse> {
			const url = 'posts?limit=5';

			try {
				return await this.client.post<PostsCollectionResponse>(url, filters);
			} catch (error) {
				return parseError(error);
			}
		},
		async getPost(slug: string): Promise<PostResponse> {
			const url = `posts/${slug}`;

			try {
				return await this.client.get<PostResponse>(url);
			} catch (error) {
				return parseError(error);
			}
		},
	},
});
