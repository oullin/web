export interface RecommendationsResponse {
	uuid: string;
	relation: string;
	text: string;
	created_at: string;
	person: RecommendationPerson;
}

export interface RecommendationPerson {
	avatar: string;
	full_name: string;
	company: string;
	designation: string;
}
