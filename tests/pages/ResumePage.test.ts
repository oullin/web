import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ResumePage from '@pages/ResumePage.vue';
import type { EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';
import { Heights } from '@/support/heights';

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

const getExperience = vi.fn<[], Promise<{ version: string; data: ExperienceResponse[] }>>(() => Promise.resolve({ version: '1.0.0', data: experience }));
const getRecommendations = vi.fn<[], Promise<{ version: string; data: RecommendationsResponse[] }>>(() => Promise.resolve({ version: '1.0.0', data: recommendations }));
const getEducation = vi.fn<[], Promise<{ version: string; data: EducationResponse[] }>>(() => Promise.resolve({ version: '1.0.0', data: education }));

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getExperience, getRecommendations, getEducation }) }));
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
					EducationPartial: true,
					ExperiencePartial: true,
					RecommendationPartial: true,
				},
			},
		});
		await flushPromises();
		expect(getExperience).toHaveBeenCalled();
		expect(getRecommendations).toHaveBeenCalled();
		expect(getEducation).toHaveBeenCalled();
		expect(wrapper.find('h1').text()).toContain('My resume');

		const dot = wrapper.find('nav span');
		expect(dot.classes()).toContain('bg-fuchsia-400/70');
		expect(dot.classes()).toContain('dark:bg-teal-500/80');
		const navLinks = wrapper.findAll('nav a');
		expect(navLinks[0].attributes('aria-current')).toBe('location');
		expect(navLinks[0].attributes('data-active')).toBe('true');
		expect(navLinks[1].attributes('aria-current')).toBeUndefined();
		expect(navLinks[1].attributes('data-active')).toBeUndefined();
		expect(navLinks[2].attributes('aria-current')).toBeUndefined();
		expect(navLinks[2].attributes('data-active')).toBeUndefined();
		expect(wrapper.find('education-partial-stub').exists()).toBe(true);
		expect(wrapper.find('experience-partial-stub').exists()).toBe(true);
		expect(wrapper.find('recommendation-partial-stub').exists()).toBe(true);
		expect(wrapper.find('[data-testid="resume-page-skeleton"]').exists()).toBe(false);
	});

	it('does not render resume sections when the API returns empty arrays', async () => {
		getExperience.mockResolvedValueOnce({ version: '1.0.0', data: [] });
		getRecommendations.mockResolvedValueOnce({ version: '1.0.0', data: [] });
		getEducation.mockResolvedValueOnce({ version: '1.0.0', data: [] });

		const wrapper = mount(ResumePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					EducationPartial: true,
					ExperiencePartial: true,
					RecommendationPartial: true,
				},
			},
		});

		await flushPromises();

		expect(wrapper.find('#education').exists()).toBe(false);
		expect(wrapper.find('#experience').exists()).toBe(false);
		expect(wrapper.find('#recommendations').exists()).toBe(false);
		const navLinks = wrapper.findAll('nav a');
		expect(navLinks[0].attributes('aria-current')).toBe('location');
		expect(wrapper.find('education-partial-stub').exists()).toBe(false);
		expect(wrapper.find('experience-partial-stub').exists()).toBe(false);
		expect(wrapper.find('recommendation-partial-stub').exists()).toBe(false);
		const skeleton = wrapper.find('[data-testid="resume-page-skeleton"]');
		expect(skeleton.exists()).toBe(false);
	});

	it('defaults the active nav item to the first rendered section when some data is missing', async () => {
		getEducation.mockResolvedValueOnce({ version: '1.0.0', data: [] });

		const wrapper = mount(ResumePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					EducationPartial: true,
					ExperiencePartial: true,
					RecommendationPartial: true,
				},
			},
		});

		await flushPromises();

		const navLinks = wrapper.findAll('nav a');
		expect(navLinks[0].attributes('aria-current')).toBeUndefined();
		expect(navLinks[1].attributes('aria-current')).toBe('location');
		expect(navLinks[1].attributes('data-active')).toBe('true');
		expect(navLinks[0].attributes('data-active')).toBeUndefined();
		expect(wrapper.find('experience-partial-stub').exists()).toBe(true);
		expect(wrapper.find('recommendation-partial-stub').exists()).toBe(true);
	});

	it('renders skeleton while the resume data is loading', () => {
		getExperience.mockReturnValueOnce(new Promise(() => {}));
		getRecommendations.mockReturnValueOnce(new Promise(() => {}));
		getEducation.mockReturnValueOnce(new Promise(() => {}));

		const wrapper = mount(ResumePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
				},
			},
		});

		const skeleton = wrapper.find('[data-testid="resume-page-skeleton"]');
		expect(skeleton.exists()).toBe(true);
		expect(skeleton.attributes('aria-hidden')).toBe('true');
		expect(skeleton.find('button').exists()).toBe(false);
		const skeletonWrapper = skeleton.element.parentElement as HTMLElement | null;
		if (!skeletonWrapper) {
			throw new Error('Skeleton wrapper not found');
		}
		const heightClasses = Heights.resumeSectionsTotalHeight().split(' ');
		heightClasses.forEach((className) => {
			expect(skeletonWrapper.classList.contains(className)).toBe(true);
		});
		const layout = skeleton.element.firstElementChild as HTMLElement | null;
		if (!layout) {
			throw new Error('Skeleton layout not found');
		}
		expect(layout.classList.contains('lg:grid')).toBe(true);
		expect(layout.classList.contains('lg:grid-cols-2')).toBe(true);
	});

	it('handles fetch failures without hiding successful sections', async () => {
		const error = new Error('oops');
		getExperience.mockRejectedValueOnce(error);
		const reloadSpy = vi.fn();
		const locationGetSpy = vi.spyOn(window, 'location', 'get');
		locationGetSpy.mockReturnValue({ reload: reloadSpy } as Location);
		const wrapper = mount(ResumePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					EducationPartial: true,
					ExperiencePartial: true,
					RecommendationPartial: true,
				},
			},
		});
		await flushPromises();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
		const skeleton = wrapper.find('[data-testid="resume-page-skeleton"]');
		expect(skeleton.exists()).toBe(false);
		const partialError = wrapper.get('[data-testid="resume-partial-error"]');
		const refreshButton = partialError.get('button');
		expect(refreshButton.text()).toBe('Refresh page');
		expect(wrapper.find('education-partial-stub').exists()).toBe(true);
		expect(wrapper.find('recommendation-partial-stub').exists()).toBe(true);
		expect(wrapper.find('experience-partial-stub').exists()).toBe(false);
		await refreshButton.trigger('click');
		expect(reloadSpy).toHaveBeenCalled();
		locationGetSpy.mockRestore();
	});

	it('shows the skeleton refresh state when all resume data requests fail', async () => {
		const error = new Error('total failure');
		getExperience.mockRejectedValueOnce(error);
		getRecommendations.mockRejectedValueOnce(error);
		getEducation.mockRejectedValueOnce(error);
		const reloadSpy = vi.fn();
		const locationGetSpy = vi.spyOn(window, 'location', 'get');
		locationGetSpy.mockReturnValue({ reload: reloadSpy } as Location);
		const wrapper = mount(ResumePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					FooterPartial: true,
					EducationPartial: true,
					ExperiencePartial: true,
					RecommendationPartial: true,
				},
			},
		});

		await flushPromises();

		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
		const skeleton = wrapper.get('[data-testid="resume-page-skeleton"]');
		expect(skeleton.attributes('aria-hidden')).toBe('false');
		const skeletonWrapper = skeleton.element.parentElement as HTMLElement | null;
		if (!skeletonWrapper) {
			throw new Error('Skeleton wrapper not found');
		}
		const heightClasses = Heights.resumeSectionsTotalHeight().split(' ');
		heightClasses.forEach((className) => {
			expect(skeletonWrapper.classList.contains(className)).toBe(true);
		});
		const layout = skeleton.element.firstElementChild as HTMLElement | null;
		if (!layout) {
			throw new Error('Skeleton layout not found');
		}
		expect(layout.classList.contains('lg:grid')).toBe(true);
		expect(layout.classList.contains('lg:grid-cols-2')).toBe(true);
		const refreshButton = skeleton.get('button');
		expect(refreshButton.text()).toBe('Refresh page');
		expect(wrapper.find('[data-testid="resume-partial-error"]').exists()).toBe(false);
		expect(wrapper.find('education-partial-stub').exists()).toBe(false);
		expect(wrapper.find('experience-partial-stub').exists()).toBe(false);
		expect(wrapper.find('recommendation-partial-stub').exists()).toBe(false);
		await refreshButton.trigger('click');
		expect(reloadSpy).toHaveBeenCalled();
		locationGetSpy.mockRestore();
	});
});
