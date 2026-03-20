import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, afterEach } from 'vitest';
import AboutPage from '@pages/AboutPage.vue';
import type { ProfileResponse, ProfileSkillResponse } from '@api/response/index.ts';
import { createRouter, createMemoryHistory, RouterView, type Router } from 'vue-router';
import { defineComponent } from 'vue';
import { aboutPageContent } from '@support/content.ts';

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
const getRecommendations = vi.fn();

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile, getRecommendations }) }));

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
				FooterPartial: true,
				RecommendationPartial: defineComponent({
					template: '<div data-testid="recommendation-partial">Recommendations partial</div>',
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
		expect(getRecommendations).not.toHaveBeenCalled();
		expect(wrapper.find('h1').text()).toContain(aboutPageContent.hero.title);
		aboutPageContent.hero.copy.forEach((paragraph) => {
			expect(wrapper.text()).toContain(paragraph);
		});
		expect(wrapper.text()).toContain(aboutPageContent.sidebar.founder.copy);
		expect(wrapper.text()).toContain(aboutPageContent.sidebar.proof.items[1]);
		expect(wrapper.find('[data-testid="recommendation-partial"]').text()).toContain('Recommendations partial');
		expect(wrapper.html()).toContain(aboutPageContent.sidebar.founder.linkUrl);
	});

	it('renders the about footer without the skills marquee band', async () => {
		const wrapper = await mountComponent();
		await flushPromises();

		const html = wrapper.html();
		const footerIndex = html.indexOf('<footer-partial-stub');

		expect(footerIndex).toBeGreaterThan(-1);
		expect(html).toContain('site-footer--about');
		expect(html).not.toContain('skills-band skills-band--about');
	});

	it('renders skeleton while loading the profile', async () => {
		getProfile.mockReturnValueOnce(new Promise(() => {}));

		const wrapper = await mountComponent();

		const skeleton = wrapper.find('[data-testid="about-connect-skeleton"]');
		expect(skeleton.exists()).toBe(true);
		expect(skeleton.classes()).toContain('min-h-[25rem]');
	});

	it('handles profile errors gracefully', async () => {
		getProfile.mockRejectedValueOnce(new Error('fail'));
		const wrapper = await mountComponent();
		await flushPromises();
		expect(wrapper.text()).toContain('We are currently unable to load contact details');
	});
});
