export interface CategoriesCollectionResponse {
	page: number;
	total: number;
	page_size: number;
	total_pages: number;
	data: CategoryResponse[];
}

export interface CategoryResponse {
	uuid: string;
	name: string;
	slug: string;
	description: string;
}
