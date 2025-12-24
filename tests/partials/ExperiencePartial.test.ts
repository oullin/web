import { mount, flushPromises } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExperiencePartial from '@partials/ExperiencePartial.vue';
import type { ExperienceResponse } from '@api/response/index.ts';

const renderMarkdown = vi.hoisted(() => vi.fn((text: string) => `<p><strong>${text}</strong></p>`));
const initializeHighlighter = vi.hoisted(() => vi.fn(() => Promise.resolve()));
const loadHighlightTheme = vi.hoisted(() => vi.fn());
const mockHighlightElement = vi.hoisted(() => vi.fn());

vi.mock('@/support/markdown.ts', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		renderMarkdown,
		initializeHighlighter,
		loadHighlightTheme,
	};
});

vi.mock('highlight.js/lib/core', () => ({
	default: {
		highlightElement: mockHighlightElement,
	},
}));

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
	beforeEach(() => {
		vi.clearAllMocks();
	});

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

	describe('syntax highlighting', () => {
		it('initializes highlighter when component mounts with experience data', async () => {
			mount(ExperiencePartial, {
				props: { experience, backToTopTarget: '#top' },
			});

			await flushPromises();

			expect(initializeHighlighter).toHaveBeenCalled();
		});

		it('does not highlight when experienceContainer is not available', async () => {
			const _wrapper = mount(ExperiencePartial, {
				props: { experience: [], backToTopTarget: '#top' },
			});

			await flushPromises();

			// Should not attempt highlighting with empty data
			expect(mockHighlightElement).not.toHaveBeenCalled();
		});

		it('applies syntax highlighting to code blocks after mount', async () => {
			// Mock renderMarkdown to return HTML with code blocks
			renderMarkdown.mockReturnValue('<pre><code class="language-js">const x = 1;</code></pre>');

			const wrapper = mount(ExperiencePartial, {
				props: { experience, backToTopTarget: '#top' },
			});

			await flushPromises();

			// Wait for DOM updates and watchEffect
			await wrapper.vm.$nextTick();
			await flushPromises();

			const codeBlocks = wrapper.findAll('pre code');
			expect(codeBlocks.length).toBe(1);
			expect(initializeHighlighter).toHaveBeenCalled();
		});

		it('re-applies highlighting when experience data changes', async () => {
			renderMarkdown.mockReturnValue('<pre><code>const x = 1;</code></pre>');

			const wrapper = mount(ExperiencePartial, {
				props: { experience, backToTopTarget: '#top' },
			});

			await flushPromises();
			await wrapper.vm.$nextTick();

			const initialCallCount = mockHighlightElement.mock.calls.length;

			// Update experience data
			const newExperience: ExperienceResponse[] = [{ ...experience[0], uuid: faker.string.uuid(), summary: 'Updated summary' }];

			await wrapper.setProps({ experience: newExperience });
			await flushPromises();
			await wrapper.vm.$nextTick();

			// Highlighting should be re-applied
			expect(mockHighlightElement.mock.calls.length).toBeGreaterThan(initialCallCount);
		});

		it('handles empty experience array gracefully', async () => {
			const wrapper = mount(ExperiencePartial, {
				props: { experience: [], backToTopTarget: '#top' },
			});

			await flushPromises();

			// Should not error and should not attempt highlighting
			expect(wrapper.findAll('li')).toHaveLength(0);
			expect(mockHighlightElement).not.toHaveBeenCalled();
		});
	});
});
