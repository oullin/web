export interface ProfileResponse {
	nickname: string;
	handle: string;
	name: string;
	email: string;
	profession: string;
	skills: ProfileSkillResponse[];
}

export interface ProfileSkillResponse {
	uuid: string;
	percentage: number;
	item: string;
	description: string;
}
