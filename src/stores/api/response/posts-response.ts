export interface PostsCollectionResponse {
	page: number;
	total: number;
	page_size: number;
	total_pages: number;
	data: PostResponse[];
}

export interface PostResponse {
	uuid: string;
	author: PostsAuthorResponse;
	categories: PostsCategoryResponse[];
	tags: PostsTagResponse[];
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	cover_image_url: string;
	published_at: string;
	created_at: string;
	updated_at: string;
}

export interface PostsAuthorResponse {
	uuid: string;
	first_name: string;
	last_name: string;
	username: string;
	display_name: string;
	bio: string;
	picture_file_name: string;
	profile_picture_url: string;
}

export interface PostsCategoryResponse {
	uuid: string;
	name: string;
	slug: string;
	description: string;
}

export interface PostsTagResponse {
	uuid: string;
	name: string;
	description: string;
}
