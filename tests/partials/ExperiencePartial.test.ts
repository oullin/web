import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import ExperiencePartial from '@partials/ExperiencePartial.vue';
import type { ExperienceResponse } from '@api/response/index.ts';

const renderMarkdown = vi.hoisted(() => vi.fn((text: string) => `<p><strong>${text}</strong></p>`));
const initializeHighlighter = vi.hoisted(() => vi.fn(() => Promise.resolve()));

vi.mock('@/support/markdown.ts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		renderMarkdown,
		initializeHighlighter,
	};
});

const experience: ExperienceResponse[] = [
	{
		uuid: faker.string.uuid(),
		start_date: faker.date.past().getFullYear().toString(),
		end_date: faker.date.recent().getFullYear().toString(),
		position: faker.person.jobTitle(),
		company: faker.company.name(),
		summary: 'Great experience working here',
		skills: faker.lorem.word(),
		employment_type: faker.lorem.word(),
		location_type: faker.lorem.word(),
		country: faker.location.country(),
		city: faker.location.city(),
	},
];

describe('ExperiencePartial', () => {
	it('renders each experience item', () => {
		const wrapper = mount(ExperiencePartial, { props: { experience, backToTopTarget: '#top' } });
		const items = wrapper.findAll('li');
		expect(items).toHaveLength(1);
		expect(items[0].text()).toContain(experience[0].company);
	});

	it('sanitises and formats experience summary as markdown', () => {
		const wrapper = mount(ExperiencePartial, {
			props: { experience, backToTopTarget: '#top' },
		});

		expect(renderMarkdown).toHaveBeenCalledWith('Great experience working here');
		expect(wrapper.html()).toContain('<strong>Great experience working here</strong>');
	});

	it('renders v-html with post-markdown class', () => {
		const wrapper = mount(ExperiencePartial, {
			props: { experience, backToTopTarget: '#top' },
		});

		const markdownDiv = wrapper.find('.post-markdown');
		expect(markdownDiv.exists()).toBe(true);
		expect(markdownDiv.classes()).toContain('!text-sm');
		expect(markdownDiv.classes()).toContain('!leading-normal');
		expect(markdownDiv.classes()).toContain('!text-slate-500');
	});

	it('processes multiple experience items', () => {
		const multipleExperience: ExperienceResponse[] = [
			{ ...experience[0], summary: 'First job summary' },
			{ ...experience[0], uuid: faker.string.uuid(), summary: 'Second job summary' },
		];

		const wrapper = mount(ExperiencePartial, {
			props: { experience: multipleExperience, backToTopTarget: '#top' },
		});

		expect(renderMarkdown).toHaveBeenCalledWith('First job summary');
		expect(renderMarkdown).toHaveBeenCalledWith('Second job summary');
		expect(wrapper.findAll('li')).toHaveLength(2);
	});

	it('sanitizes HTML to prevent XSS attacks', () => {
		const maliciousExperience: ExperienceResponse[] = [
			{
				...experience[0],
				summary: '<script>alert("xss")</script>Safe text',
			},
		];

		const wrapper = mount(ExperiencePartial, {
			props: { experience: maliciousExperience, backToTopTarget: '#top' },
		});

		// DOMPurify should strip the script tag
		expect(wrapper.html()).not.toContain('<script>');
		expect(wrapper.html()).not.toContain('alert("xss")');
	});
});
