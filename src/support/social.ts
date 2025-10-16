import { computed } from 'vue';
import type { Ref } from 'vue';
import type { SocialResponse } from '@api/response/index.ts';

interface HeaderPlatformConfig {
	icon: string;
	iconClass: string;
}

export interface HeaderSocialLink {
	name: string;
	url: string;
	label: string;
	title: string;
	icon: string;
	iconClass: string;
}

const headerSocialPlatforms: Record<string, HeaderPlatformConfig> = {
	github: {
		icon: 'M8 0a8 8 0 00-2.53 15.6c.4.07.55-.17.55-.38v-1.33c-2.24.49-2.71-1.08-2.71-1.08-.36-.92-.88-1.16-.88-1.16-.72-.5.05-.49.05-.49.8.06 1.22.83 1.22.83.71 1.22 1.86.87 2.31.67.07-.52.28-.87.5-1.07-1.79-.2-3.68-.9-3.68-4a3.13 3.13 0 01-.83-2.16 2.92 2.92 0 01.08-2.13s.67-.22 2.2.82a7.65 7.65 0 012 0c1.53-1 2.2-.82 2.2-.82a2.92 2.92 0 01.08 2.13 3.13 3.13 0 01.83 2.16c0 3.11-1.9 3.8-3.7 4 .29.25.54.74.54 1.5v2.22c0 .21.15.45.56.38A8 8 0 008 0z',
		iconClass: 'fill-fuchsia-400 hover:fill-fuchsia-600 dark:fill-teal-500 dark:hover:fill-teal-300',
	},
	linkedin: {
		icon: 'M14.23 0H1.77A1.77 1.77 0 000 1.77v12.46A1.77 1.77 0 001.77 16h12.46A1.77 1.77 0 0016 14.23V1.77A1.77 1.77 0 0014.23 0zM4.95 13.33H2.67V6h2.28zM3.81 4.94a1.32 1.32 0 111.32-1.32 1.32 1.32 0 01-1.32 1.32zM13.33 13.33h-2.28v-3.9c0-.93-.02-2.13-1.3-2.13s-1.5 1.02-1.5 2.07v3.96H6a.05.05 0 01-.05-.05V6h2.19v1.01h.03a2.42 2.42 0 012.16-1.19c2.31 0 2.74 1.52 2.74 3.49z',
		iconClass: 'fill-fuchsia-400 hover:fill-fuchsia-600 dark:fill-teal-500 dark:hover:fill-teal-300',
	},
};

const headerSocialOrder: Array<keyof typeof headerSocialPlatforms> = ['github', 'linkedin'];

export const useHeaderSocialLinks = (social: Ref<SocialResponse[]>) =>
	computed<HeaderSocialLink[]>(() => {
		const links: HeaderSocialLink[] = [];

		for (const name of headerSocialOrder) {
			const platform = headerSocialPlatforms[name];
			const socialEntry = social.value.find((item) => item.name === name);

			if (!platform || !socialEntry) {
				continue;
			}

			const description = socialEntry.description?.trim();
			const handle = socialEntry.handle?.trim();

			const accessibleText = description || handle || socialEntry.name;
			const { icon, iconClass } = platform;

			const link: HeaderSocialLink = {
				name: socialEntry.name,
				url: socialEntry.url,
				label: accessibleText,
				title: accessibleText,
				icon,
				iconClass,
			};

			links.push(link);
		}

		return links;
	});
