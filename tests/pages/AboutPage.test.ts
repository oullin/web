import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import AboutPage from '@pages/AboutPage.vue';
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
    nickname: faker.word.words(1).toLowerCase(),
    handle: faker.internet.userName(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    profession: faker.person.jobTitle(),
    skills,
};

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>(() =>
    Promise.resolve({ data: profile })
);

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile }) }));

describe('AboutPage', () => {
    it('shows formatted nickname', async () => {
        const wrapper = mount(AboutPage, {
            global: {
                stubs: {
                    SideNavPartial: true,
                    HeaderPartial: true,
                    WidgetSocialPartial: true,
                    WidgetSkillsPartial: true,
                    FooterPartial: true,
                },
            },
        });
        await flushPromises();
        const formatted = profile.nickname.charAt(0).toUpperCase() + profile.nickname.slice(1);
        expect(getProfile).toHaveBeenCalled();
        expect(wrapper.find('h1').text()).toContain(formatted);
    });
});
