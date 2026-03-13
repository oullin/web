import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import HomePage from '@pages/HomePage.vue';
import marquee from '@fixtures/marquee.json';
import principles from '@fixtures/principles.json';
import about from '@fixtures/about.json';
import cta from '@fixtures/cta.json';
import type { ProfileResponse } from '@api/response/index.ts';

const profile: ProfileResponse = {
	nickname: 'Gus',
	handle: 'gocanto',
	name: 'Gustavo Ocanto',
	email: 'gus@oullin.io',
	profession: 'Engineering Leader',
	skills: [],
};

const getProfile = vi.fn<[], Promise<{ data: ProfileResponse }>>(() => Promise.resolve({ data: profile }));

vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getProfile }) }));
vi.mock('@api/http-error.ts', () => ({ debugError: vi.fn() }));

const global = {
	stubs: {
		NavPartial: true,
		HeroPartial: true,
		RouterLink: { template: '<a><slot /></a>' },
	},
};

describe('HomePage', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('fetches the profile on mount', async () => {
		mount(HomePage, { global });
		await flushPromises();
		expect(getProfile).toHaveBeenCalledOnce();
	});

	it('renders all marquee items', () => {
		const wrapper = mount(HomePage, { global });
		marquee.items.forEach((item) => {
			expect(wrapper.text()).toContain(item);
		});
	});

	it('renders all principles', () => {
		const wrapper = mount(HomePage, { global });
		principles.items.forEach((p) => {
			expect(wrapper.text()).toContain(p.tag);
			expect(wrapper.text()).toContain(p.body);
		});
	});

	it('renders the about section with the profile name', async () => {
		const wrapper = mount(HomePage, { global });
		await flushPromises();
		profile.name
			.toUpperCase()
			.split(' ')
			.forEach((part) => expect(wrapper.text()).toContain(part));
		expect(wrapper.text()).toContain(about.body.role);
		about.work.forEach((item) => {
			expect(wrapper.text()).toContain(item.title);
		});
	});

	it('renders the cta section', () => {
		const wrapper = mount(HomePage, { global });
		expect(wrapper.text()).toContain(cta.watermark);
		expect(wrapper.text()).toContain(cta.headlineAccent);
		expect(wrapper.text()).toContain(cta.button.label);
	});
});
