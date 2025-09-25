<template>
	<div v-if="social.length > 0" class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="flex items-center space-x-3 mb-2">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 blog-side-nav-router-link-a-active">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
				/>
			</svg>
			<span class="text-xs text-slate-400 dark:text-slate-500">Social</span>
		</div>

		<ul role="list" class="mt-5 space-y-2">
			<li v-for="item in social" :key="item.uuid">
                                <a
                                        v-if="socialPlatforms[item.name]"
                                        v-lazy-link
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        :href="item.url"
                                        :title="item.description"
                                        class="group blog-widgets-social-links"
                                >
					<svg viewBox="0 0 24 24" aria-hidden="true" class="blog-widgets-social-svg">
						<path :d="socialPlatforms[item.name].icon" />
					</svg>
					<span class="ml-4">{{ socialPlatforms[item.name].text }}</span>
				</a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { SocialResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const social = ref<SocialResponse[]>([]);

interface PlatformConfig {
	icon: string;
	text: string;
}

const socialPlatforms: Record<string, PlatformConfig> = {
	x: {
		icon: 'M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z',
		text: 'Follow me on X',
	},
	youtube: {
		icon: 'M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z',
		text: 'Subscribe to my channel',
	},
	instagram: {
		icon: 'M7.5,2h9A5.5,5.5,0,0,1,22,7.5v9A5.5,5.5,0,0,1,16.5,22h-9A5.5,5.5,0,0,1,2,16.5v-9A5.5,5.5,0,0,1,7.5,2ZM12,16A4,4,0,1,0,12,8,4,4,0,0,0,12,16Z',
		text: 'Follow me on Instagram',
	},
	linkedin: {
		icon: 'M19,3H5C3.89,3,3,3.89,3,5V19C3,20.1,3.89,21,5,21H19C20.1,21,21,20.1,21,19V5C21,3.89,20.1,3,19,3M8.5,18H5.5V10H8.5V18M6.94,8.5C6.16,8.5,5.5,7.83,5.5,7C5.5,6.17,6.16,5.5,6.94,5.5C7.72,5.5,8.38,6.17,8.38,7C8.38,7.83,7.72,8.5,6.94,8.5M18.5,18H15.5V14.25C15.5,13.17,14.67,12.25,13.5,12.25C12.5,12.25,11.5,13,11.5,14.25V18H8.5V10H11.5V11.25C12.06,10.25,13,9.5,14.25,9.5C16.5,9.5,18.5,11.25,18.5,14V18Z',
		text: 'Follow me on LinkedIn',
	},
	github: {
		icon: 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 4.97,16.5 4.97,16.5C4.05,15.82 5.06,15.82 5.06,15.82C6.06,15.89 6.63,16.83 6.63,16.83C7.5,18.31 8.95,17.88 9.5,17.61C9.58,17.03 9.84,16.6 10.12,16.34C7.89,16.1 5.5,15.27 5.5,11.5C5.5,10.39 5.89,9.53 6.5,8.84C6.38,8.58 6.08,7.7 6.63,6.5C6.63,6.5 7.43,6.26 9.5,7.7C10.27,7.5 11.14,7.39 12,7.39C12.86,7.39 13.73,7.5 14.5,7.7C16.57,6.26 17.37,6.5 17.37,6.5C17.92,7.7 17.62,8.58 17.5,8.84C18.11,9.53 18.5,10.39 18.5,11.5C18.5,15.27 16.1,16.1 13.88,16.34C14.24,16.64 14.5,17.27 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z',
		text: 'Follow me on GitHub',
	},
};

onMounted(async () => {
	try {
		const socialResponse = await apiStore.getSocial();

		if (socialResponse.data) {
			social.value = socialResponse.data;
		}
	} catch (error) {
		debugError(error);
	}
});
</script>
