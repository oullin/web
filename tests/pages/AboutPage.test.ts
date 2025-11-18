import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, afterEach } from 'vitest';
import AboutPage from '@pages/AboutPage.vue';
import type { ProfileResponse, ProfileSkillResponse } from '@api/response/index.ts';
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
	handle: faker.internet.userName(),
	name: faker.person.fullName(),
	email: faker.internet.email(),
	profession: faker.person.jobTitle(),
	skills,
};

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>(() => Promise.resolve({ data: profile }));

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile }) }));
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
			},
		},
	});
};

describe('AboutPage', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('shows formatted nickname', async () => {
		const wrapper = await mountComponent();
		await flushPromises();
		const formatted = profile.nickname.charAt(0).toUpperCase() + profile.nickname.slice(1);
		expect(getProfile).toHaveBeenCalled();
		expect(wrapper.find('h1').text()).toContain(formatted);
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
