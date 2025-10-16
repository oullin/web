import { ref } from 'vue';
import { describe, it, expect } from 'vitest';
import type { SocialResponse } from '@api/response/index.ts';
import { socialPlatforms, useHeaderSocialLinks } from '@/support/social.ts';

describe('useHeaderSocialLinks', () => {
	it('builds ordered header links with trimmed metadata', () => {
		const social = ref<SocialResponse[]>([
			{
				uuid: 'github-id',
				name: 'github',
				url: 'https://github.example.com',
				handle: '   ignored   ',
				description: '  Showcase  ',
			},
			{
				uuid: 'linkedin-id',
				name: 'linkedin',
				url: 'https://linkedin.example.com',
				handle: '   @example   ',
				description: '   ',
			},
			{
				uuid: 'other-id',
				name: 'mastodon',
				url: 'https://social.example.com',
				handle: '@other',
				description: 'Other network',
			},
		]);

		const links = useHeaderSocialLinks(social).value;

		expect(links).toHaveLength(2);
		expect(links[0]).toMatchObject({
			name: 'github',
			url: 'https://github.example.com',
			label: 'Showcase',
			title: 'Showcase',
			icon: socialPlatforms.github.icon,
			iconClass: 'fill-current',
		});
		expect(links[1]).toMatchObject({
			name: 'linkedin',
			url: 'https://linkedin.example.com',
			label: '@example',
			title: '@example',
			icon: socialPlatforms.linkedin.icon,
		});
	});

	it('reacts to social feed updates and falls back to platform name', () => {
		const social = ref<SocialResponse[]>([]);
		const headerLinks = useHeaderSocialLinks(social);

		expect(headerLinks.value).toEqual([]);

		social.value = [
			{
				uuid: 'linkedin-id',
				name: 'linkedin',
				url: 'https://linkedin.example.com',
				handle: '',
				description: '',
			},
		];

		expect(headerLinks.value).toMatchObject([
			{
				name: 'linkedin',
				url: 'https://linkedin.example.com',
				label: 'linkedin',
				title: 'linkedin',
				icon: socialPlatforms.linkedin.icon,
				iconClass: 'fill-current',
			},
		]);

		social.value = [
			{
				uuid: 'github-id',
				name: 'github',
				url: 'https://github.example.com',
				handle: '',
				description: '    ',
			},
		];

		expect(headerLinks.value).toMatchObject([
			{
				name: 'github',
				url: 'https://github.example.com',
				label: 'github',
				title: 'github',
				icon: socialPlatforms.github.icon,
				iconClass: 'fill-current',
			},
		]);
	});
});
