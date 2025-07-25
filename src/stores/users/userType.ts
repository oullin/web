export interface Social {
	handle: string;
	url: string;
	name: string;
	description: string;
}

export type SocialMediaMap = Record<string, Social>;

export interface Experience {
	uuid: string;
	company: string;
	employment_type: string;
	location_type: string;
	position: string;
	start_date: string;
	end_date: string;
	summary: string;
	country: string;
	city: string;
	skills: string;
}

export interface Project {
	uuid: string;
	language?: string;
	title: string;
	excerpt: string;
	description?: string;
	url: string;
	isOpenSource: boolean;
	icon: string;
	created_at: string;
	updated_at: string;
}

export interface Talks {
	uuid: string;
	title: string;
	subject: string;
	location: string;
	url?: string;
	photo: string;
	description?: string;
	created_at: string;
	updated_at: string;
}

export interface Recommendation {
	uuid: string;
	relation: string;
	text: string;
	person: RecommendationPerson;
	created_at: string;
	updated_at: string;
}

export interface RecommendationPerson {
	avatar: string;
	full_name: string;
	company: string;
	designation: string;
}

export interface Education {
	uuid: string;
	icon: string;
	school: string;
	degree: string;
	field: string;
	description: string;
	graduated_at: string;
	issuing_country: string;
}

export interface User {
	nickname: string;
	handle: string;
	name: string;
	email: string;
	profession: string;
	salt: string;
	education: Education[];
	social: Social[];
	experience: Experience[];
	projects: Project[];
	talks: Talks[];
	recommendations: Recommendation[];
}
