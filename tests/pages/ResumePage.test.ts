import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ResumePage from '@pages/ResumePage.vue';
import type { ProfileResponse, ProfileSkillResponse, EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';

const skills: ProfileSkillResponse[] = [{ uuid: faker.string.uuid(), percentage: 50, item: faker.lorem.word(), description: faker.lorem.sentence() }];
const profile: ProfileResponse = {
	nickname: faker.person.firstName(),
	handle: faker.internet.userName(),
	name: faker.person.fullName(),
	email: faker.internet.email(),
	profession: faker.person.jobTitle(),
	skills,
};
const education: EducationResponse[] = [
	{
		uuid: faker.string.uuid(),
		icon: faker.image.avatarGitHub(),
		school: faker.company.name(),
		degree: faker.word.words(1),
		field: faker.lorem.word(),
		description: faker.lorem.sentence(),
		graduated_at: '2020',
		issuing_country: faker.location.country(),
	},
];
const experience: ExperienceResponse[] = [
	{
		uuid: faker.string.uuid(),
		company: faker.company.name(),
		employment_type: 'full-time',
		location_type: 'remote',
		position: faker.person.jobTitle(),
		start_date: '2020',
		end_date: '2021',
		summary: faker.lorem.sentence(),
		country: faker.location.country(),
		city: faker.location.city(),
		skills: faker.lorem.word(),
	},
];
const recommendations: RecommendationsResponse[] = [
	{
		uuid: faker.string.uuid(),
		relation: 'friend',
		text: faker.lorem.sentence(),
		created_at: faker.date.past().toISOString(),
		person: {
			avatar: faker.image.avatar(),
			full_name: faker.person.fullName(),
			company: faker.company.name(),
			designation: faker.person.jobTitle(),
		},
	},
];

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>(() => Promise.resolve({ data: profile }));
const getExperience = vi.fn<[], Promise<{ version: string; data: ExperienceResponse[] }>>(() => Promise.resolve({ version: '1.0.0', data: experience }));
const getRecommendations = vi.fn<[], Promise<{ version: string; data: RecommendationsResponse[] }>>(() => Promise.resolve({ version: '1.0.0', data: recommendations }));
const getEducation = vi.fn<[], Promise<{ version: string; data: EducationResponse[] }>>(() => Promise.resolve({ version: '1.0.0', data: education }));

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile, getExperience, getRecommendations, getEducation }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

describe('ResumePage', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('fetches data on mount', async () => {
		const wrapper = mount(ResumePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					WidgetLangPartial: true,
					WidgetSkillsPartial: true,
					EducationPartial: true,
					ExperiencePartial: true,
					RecommendationPartial: true,
				},
			},
		});
		await flushPromises();
		expect(getProfile).toHaveBeenCalled();
		expect(getExperience).toHaveBeenCalled();
		expect(getRecommendations).toHaveBeenCalled();
		expect(getEducation).toHaveBeenCalled();
		expect(wrapper.find('h1').text()).toContain('My resume');
	});

	it('renders skeleton while the resume data is loading', () => {
		getProfile.mockReturnValueOnce(new Promise(() => {}));
		getExperience.mockReturnValueOnce(new Promise(() => {}));
		getRecommendations.mockReturnValueOnce(new Promise(() => {}));
		getEducation.mockReturnValueOnce(new Promise(() => {}));

		const wrapper = mount(ResumePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					WidgetLangPartial: true,
					WidgetSkillsPartial: true,
				},
			},
		});

		expect(wrapper.find('[data-testid="resume-page-skeleton"]').exists()).toBe(true);
	});

	it('handles fetch failures', async () => {
		const error = new Error('oops');
		getProfile.mockRejectedValueOnce(error);
		const wrapper = mount(ResumePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					WidgetLangPartial: true,
					WidgetSkillsPartial: true,
					EducationPartial: true,
					ExperiencePartial: true,
					RecommendationPartial: true,
				},
			},
		});
		await flushPromises();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
	});
});
