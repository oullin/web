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
	photo?: string;
	description?: string;
	created_at: string;
	updated_at: string;
}

export interface User {
	nickname: string;
	handle: string;
	name: string;
	email: string;
	profession: string;
	salt: string;
	social: Social[];
	experience: Experience[];
	projects: Project[];
	talks: Talks[];
}
