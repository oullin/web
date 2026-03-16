import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ResumePage from '@pages/ResumePage.vue';
import type { ProfileResponse, EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';
import { resumeSectionsTotalHeight } from '@/support/heights';

const profile: ProfileResponse = {
	nickname: faker.person.firstName(),
	handle: faker.internet.username(),
	name: faker.person.fullName(),
	email: faker.internet.email(),
	profession: faker.person.jobTitle(),
	skills: [],
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

const global = {
	stubs: {
		NavPartial: true,
		WidgetLangPartial: true,
		WidgetSkillsTransitionWrapper: true,
		EducationPartial: true,
		ExperiencePartial: true,
		RecommendationPartial: true,
		BackToTopLink: true,
		RouterLink: { template: '<a><slot /></a>' },
	},
};

describe('ResumePage', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('fetches data on mount', async () => {
		const wrapper = mount(ResumePage, { global });
		await flushPromises();
		expect(getProfile).toHaveBeenCalled();
		expect(getExperience).toHaveBeenCalled();
		expect(getRecommendations).toHaveBeenCalled();
		expect(getEducation).toHaveBeenCalled();
		expect(wrapper.find('h1').text()).toContain('My resume');
		const links = wrapper.findAll('nav a');
		expect(links).toHaveLength(3);
		expect(links.map((link) => link.text())).toEqual(['Education', 'Work Experience', 'Recommendations']);
	});

	it('renders skeleton while the resume data is loading', () => {
		getProfile.mockReturnValueOnce(new Promise(() => {}));
		getExperience.mockReturnValueOnce(new Promise(() => {}));
		getRecommendations.mockReturnValueOnce(new Promise(() => {}));
		getEducation.mockReturnValueOnce(new Promise(() => {}));
		const wrapper = mount(ResumePage, { global });
		const skeleton = wrapper.find('[data-testid="resume-page-skeleton"]');
		expect(skeleton.exists()).toBe(true);
		expect(skeleton.attributes('aria-hidden')).toBe('true');
		expect(skeleton.find('button').exists()).toBe(false);
		const skeletonWrapper = skeleton.element.parentElement as HTMLElement | null;
		if (!skeletonWrapper) throw new Error('Skeleton wrapper not found');
		resumeSectionsTotalHeight()
			.split(' ')
			.forEach((cls) => {
				expect(skeletonWrapper.classList.contains(cls)).toBe(true);
			});
	});

	it('handles fetch failures', async () => {
		const error = new Error('oops');
		getProfile.mockRejectedValueOnce(error);
		const reloadSpy = vi.fn();
		const locationGetSpy = vi.spyOn(window, 'location', 'get');
		locationGetSpy.mockReturnValue({ reload: reloadSpy } as Location);
		const wrapper = mount(ResumePage, { global });
		await flushPromises();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
		const skeleton = wrapper.find('[data-testid="resume-page-skeleton"]');
		expect(skeleton.exists()).toBe(true);
		expect(skeleton.attributes('aria-hidden')).toBe('false');
		const refreshButton = skeleton.get('button');
		expect(refreshButton.text()).toBe('Refresh page');
		const skeletonWrapper = skeleton.element.parentElement as HTMLElement | null;
		if (!skeletonWrapper) throw new Error('Skeleton wrapper not found');
		resumeSectionsTotalHeight()
			.split(' ')
			.forEach((cls) => {
				expect(skeletonWrapper.classList.contains(cls)).toBe(true);
			});
		await refreshButton.trigger('click');
		expect(reloadSpy).toHaveBeenCalled();
		locationGetSpy.mockRestore();
	});
});
