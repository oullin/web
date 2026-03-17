import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, afterEach } from 'vitest';
import AboutPage from '@pages/AboutPage.vue';
import type { ProfileResponse, ProfileSkillResponse, RecommendationsResponse } from '@api/response/index.ts';
import { createRouter, createMemoryHistory, RouterView, type Router } from 'vue-router';
import { defineComponent } from 'vue';

const skills: ProfileSkillResponse[] = [
	{
		uuid: faker.string.uuid(),
		percentage: faker.number.int({ min: 1, max: 100 }),
		item: faker.lorem.word(),
		description: faker.lorem.sentence(),
	},
];

const profile: ProfileResponse = {
	nickname: faker.word.words(1).toLowerCase(),
	handle: faker.internet.username(),
	name: faker.person.fullName(),
	email: faker.internet.email(),
	profession: faker.person.jobTitle(),
	skills,
};

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>(() => Promise.resolve({ data: profile }));
const getSocial = vi.fn(() => Promise.resolve({ data: [] }));
const recommendations: RecommendationsResponse[] = [
	{
		uuid: faker.string.uuid(),
		relation: faker.lorem.word(),
		text: faker.lorem.paragraph(),
		created_at: faker.date.past().toISOString(),
		person: {
			full_name: faker.person.fullName(),
			company: faker.company.name(),
			avatar: faker.image.avatar(),
			designation: faker.person.jobTitle(),
		},
	},
];
const getRecommendations = vi.fn<[], Promise<{ data: RecommendationsResponse[] }>>(() => Promise.resolve({ data: recommendations }));

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile, getSocial, getRecommendations }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

const App = defineComponent({
	template: '<router-view />',
	components: { RouterView },
});

let router: Router;

const mountComponent = async () => {
	router = createRouter({
		history: createMemoryHistory(),
		routes: [{ path: '/', name: 'About', component: AboutPage }],
	});
	await router.push('/');
	await router.isReady();

	return mount(App, {
		global: {
			plugins: [router],
			stubs: {
				SideNavPartial: true,
				HeaderPartial: true,
				WidgetSocialTransitionWrapper: true,
				WidgetSkillsPartial: true,
				FooterPartial: true,
				RecommendationPartial: defineComponent({
					props: {
						recommendations: { type: Array, required: true },
					},
					template: '<div data-testid="recommendation-partial">{{ recommendations.length }}</div>',
				}),
			},
		},
	});
};

describe('AboutPage', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('renders the Oullin brand page title', async () => {
		const wrapper = await mountComponent();
		await flushPromises();
		expect(getProfile).toHaveBeenCalled();
		expect(getSocial).toHaveBeenCalled();
		expect(getRecommendations).toHaveBeenCalled();
		expect(wrapper.find('h1').text()).toContain('Oullin.');
		expect(wrapper.find('[data-testid="recommendation-partial"]').text()).toContain('1');
	});

	it('renders skeleton while loading the profile', async () => {
		getProfile.mockReturnValueOnce(new Promise(() => {}));

		const wrapper = await mountComponent();

		const skeleton = wrapper.find('[data-testid="about-connect-skeleton"]');
		expect(skeleton.exists()).toBe(true);
		expect(skeleton.classes()).toContain('min-h-[25rem]');
	});

	it('handles profile errors gracefully', async () => {
		const error = new Error('fail');
		getProfile.mockRejectedValueOnce(error);
		await mountComponent();
		await flushPromises();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
	});
});
