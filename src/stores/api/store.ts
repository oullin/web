import { defineStore } from 'pinia';
import { parseError } from '@api/http-error.ts';
import { ApiClient, ApiResponse, defaultCreds } from '@api/client.ts';

import type {
	ProfileResponse,
	EducationResponse,
	ExperienceResponse,
	CategoriesCollectionResponse,
	RecommendationsResponse,
	PostResponse,
	PostsCollectionResponse,
	PostsFilters,
	ProjectsResponse,
	TalksResponse,
	SocialResponse,
} from '@api/response/index.ts';

const STORE_KEY = 'api-client-store';

export interface ApiStoreState {
	client: ApiClient;
	searchTerm: string;
	isBooted: boolean;
}

const client = new ApiClient(defaultCreds);

export const useApiStore = defineStore(STORE_KEY, {
	state: (): ApiStoreState => ({
		client: client,
		searchTerm: '',
		isBooted: false,
	}),
	actions: {
		setSearchTerm(term: string): void {
			this.searchTerm = term;
		},
		boot(): void {
			if (this.client.isDev()) {
				console.log('API client booted ...');
			}

			this.isBooted = true;
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
		async getRecommendations(): Promise<ApiResponse<RecommendationsResponse[]>> {
			const url = 'recommendations';

			try {
				return await this.client.get<ApiResponse<RecommendationsResponse[]>>(url);
			} catch (error) {
				return parseError(error);
			}
		},
		async getProjects(): Promise<ApiResponse<ProjectsResponse[]>> {
			const url = 'projects';

			try {
				return await this.client.get<ApiResponse<ProjectsResponse[]>>(url);
			} catch (error) {
				return parseError(error);
			}
		},
		async getTalks(): Promise<ApiResponse<TalksResponse[]>> {
			const url = 'talks';

			try {
				return await this.client.get<ApiResponse<TalksResponse[]>>(url);
			} catch (error) {
				return parseError(error);
			}
		},
		async getSocial(): Promise<ApiResponse<SocialResponse[]>> {
			const url = 'social';

			try {
				return await this.client.get<ApiResponse<SocialResponse[]>>(url);
			} catch (error) {
				return parseError(error);
			}
		},
		async getEducation(): Promise<ApiResponse<EducationResponse[]>> {
			const url = 'education';

			try {
				return await this.client.get<ApiResponse<EducationResponse[]>>(url);
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
