export interface ProjectsCollectionResponse {
	version: string;
	page: number;
	total: number;
	page_size: number;
	total_pages: number;
	next_page?: number | null;
	previous_page?: number | null;
	data: ProjectsResponse[];
}

export interface ProjectsResponse {
	uuid: string;
	language: string;
	title: string;
	excerpt: string;
	url: string;
	icon: string;
	is_open_source: boolean;
	published_at?: string;
	created_at: string;
	updated_at: string;
}
