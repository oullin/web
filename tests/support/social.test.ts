import { describe, it, expect, beforeEach } from 'vitest';
import { ref, type Ref } from 'vue';
import { socialPlatforms, useHeaderSocialLinks, type HeaderSocialLink } from '@/support/social.ts';
import type { SocialResponse } from '@api/response/index.ts';

describe('social platform metadata', () => {
	it('exposes icon paths and copy for each supported platform', () => {
		expect(Object.keys(socialPlatforms).sort()).toEqual(['github', 'instagram', 'linkedin', 'x', 'youtube']);

		expect(socialPlatforms.x).toEqual(
			expect.objectContaining({
				text: 'Latest Updates',
				icon: expect.stringContaining('M13.3174 10.7749'),
			}),
		);

		expect(socialPlatforms.youtube).toEqual(
			expect.objectContaining({
				text: 'My Videos',
				icon: expect.stringContaining('M21.582,6.186'),
			}),
		);

		expect(socialPlatforms.instagram).toEqual(
			expect.objectContaining({
				text: 'Photo Stream',
				icon: expect.stringContaining('M7.5,2h9'),
			}),
		);

		expect(socialPlatforms.linkedin).toEqual(
			expect.objectContaining({
				text: 'Professional Profile',
				icon: expect.stringContaining('M19,3H5'),
			}),
		);

		expect(socialPlatforms.github).toEqual(
			expect.objectContaining({
				text: 'Code & Projects',
				icon: expect.stringContaining('M12,2A10,10'),
			}),
		);
	});
});

describe('useHeaderSocialLinks', () => {
	let social: Ref<SocialResponse[]>;

	beforeEach(() => {
		social = ref<SocialResponse[]>([]);
	});

	const expectLink = (link: HeaderSocialLink, overrides: Partial<HeaderSocialLink>) => {
		expect(link).toEqual(expect.objectContaining(overrides));
	};

	it('builds ordered header social links with accessible copy', () => {
		social.value = [
			{
				uuid: '1',
				name: 'github',
				url: 'https://github.com/example',
				description: '  Portfolio  ',
				handle: ' @example ',
			},
			{
				uuid: '2',
				name: 'linkedin',
				url: 'https://linkedin.com/in/example',
				description: '  Network with me ',
				handle: ' @linkedin ',
			},
			{
				uuid: '3',
				name: 'instagram',
				url: 'https://instagram.com/example',
				description: 'Photography',
				handle: '@photography',
			},
		];

		const links = useHeaderSocialLinks(social).value;

		expect(links).toHaveLength(2);
		expectLink(links[0], {
			name: 'github',
			url: 'https://github.com/example',
			label: 'Portfolio',
			title: 'Portfolio',
			icon: socialPlatforms.github.icon,
			iconClass: 'fill-current text-slate-600 transition-colors hover:text-fuchsia-600 dark:text-teal-200 dark:hover:text-teal-300',
		});
		expectLink(links[1], {
			name: 'linkedin',
			url: 'https://linkedin.com/in/example',
			label: 'Network with me',
			title: 'Network with me',
			icon: socialPlatforms.linkedin.icon,
			iconClass: 'fill-current text-slate-600 transition-colors hover:text-fuchsia-600 dark:text-teal-200 dark:hover:text-teal-300',
		});
	});

	it('falls back to handle or platform name and filters unsupported entries', () => {
		social.value = [
			{
				uuid: '4',
				name: 'github',
				url: 'https://github.com/example',
				description: '',
				handle: '  @example ',
			},
			{
				uuid: '5',
				name: 'linkedin',
				url: 'https://linkedin.com/in/example',
				description: '',
				handle: '',
			},
			{
				uuid: '6',
				name: 'x',
				url: 'https://x.com/example',
				description: 'News',
				handle: '@example',
			},
		];

		const links = useHeaderSocialLinks(social).value;

		expect(links).toHaveLength(2);
		expectLink(links[0], {
			name: 'github',
			label: '@example',
			title: '@example',
		});
		expectLink(links[1], {
			name: 'linkedin',
			label: 'linkedin',
			title: 'linkedin',
		});
	});
});
