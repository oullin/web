import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import EducationPartial from '@partials/EducationPartial.vue';
import type { EducationResponse } from '@api/response/index.ts';

const renderMarkdown = vi.hoisted(() => vi.fn(() => '<p><strong>hi</strong></p>'));
const initializeHighlighter = vi.hoisted(() => vi.fn(() => Promise.resolve()));

vi.mock('@/support/markdown.ts', () => ({ renderMarkdown, initializeHighlighter }));

const education: EducationResponse[] = [
	{
		uuid: faker.string.uuid(),
		degree: faker.word.words(1),
		school: faker.company.name(),
		graduated_at: '2020',
		description: '**hi**',
		icon: faker.image.avatarGitHub(),
		field: faker.lorem.word(),
		issuing_country: faker.location.country(),
	},
];

describe('EducationPartial', () => {
	it('renders markdown as html', () => {
		const wrapper = mount(EducationPartial, { props: { education } });
		expect(renderMarkdown).toHaveBeenCalledWith('**hi**');
		expect(wrapper.html()).toContain('<strong>hi</strong>');
	});
});
