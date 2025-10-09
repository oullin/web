import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '@pages/HomePage.vue';
import type { ProfileResponse, ProfileSkillResponse } from '@api/response/index.ts';

const skills: ProfileSkillResponse[] = [
	{
		uuid: faker.string.uuid(),
		percentage: faker.number.int({ min: 1, max: 100 }),
		item: faker.lorem.word(),
		description: faker.lorem.sentence(),
	},
];

const profile: ProfileResponse = {
	nickname: faker.person.firstName(),
	handle: faker.internet.userName(),
	name: faker.person.fullName(),
	email: faker.internet.email(),
	profession: faker.person.jobTitle(),
	skills,
};

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>(() => Promise.resolve({ data: profile }));

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

describe('HomePage', () => {
	it('loads profile on mount', async () => {
		const wrapper = mount(HomePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					HeroPartial: true,
					FooterPartial: true,
					ArticlesListPartial: true,
					FeaturedProjectsPartial: true,
					TalksPartial: true,
					WidgetSponsorPartial: true,
					WidgetSkillsPartial: { template: '<div class="skills" />', props: ['skills'] },
				},
			},
		});
		await flushPromises();
		expect(getProfile).toHaveBeenCalledTimes(1);
		expect(wrapper.find('.skills').exists()).toBe(true);
	});

	it('handles profile load errors', async () => {
		const error = new Error('oops');
		getProfile.mockRejectedValueOnce(error);
		const _wrapper = mount(HomePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					HeroPartial: true,
					FooterPartial: true,
					ArticlesListPartial: true,
					FeaturedProjectsPartial: true,
					TalksPartial: true,
					WidgetSponsorPartial: true,
					WidgetSkillsPartial: true,
				},
			},
		});
		await flushPromises();
		const { debugError } = await import('@api/http-error.ts');
		expect(debugError).toHaveBeenCalledWith(error);
	});

	it('renders a back to top link targeting the home container', async () => {
		const wrapper = mount(HomePage, {
			global: {
				stubs: {
					SideNavPartial: true,
					HeaderPartial: true,
					HeroPartial: true,
					FooterPartial: true,
					ArticlesListPartial: true,
					FeaturedProjectsPartial: true,
					TalksPartial: true,
					WidgetSponsorPartial: true,
					WidgetSkillsPartial: true,
				},
			},
		});

		await flushPromises();

		const backToTopLink = wrapper.find('a[href="#home-top"]');
		expect(backToTopLink.exists()).toBe(true);
	});
});
