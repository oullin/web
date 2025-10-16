<template>
	<section>
		<div class="max-w-[700px] mb-10">
			<div class="my-4">
				<AvatarPartial width="w-20" height="h-20" />

				<h1 class="h1 blog-h1 mt-5">
					I write about coding, engineering, and
					<span class="blog-fun-title-word-highlight">leadership</span> as a service.
				</h1>

				<p class="text-lg text-slate-400 dark:text-slate-300 mb-5">Writer, Speaker, Developer, AI Architect, Founder, and Leadership.</p>
				<p class="mb-5 font-aspekta text-slate-500">
					I'm a full-stack Software Engineer leader with over two decades of experience in building complex web systems and products, specialising in areas like e-commerce, banking,
					cross-payment solutions, cyber security, and customer success.
				</p>
			</div>

			<div v-if="heroSocialLinks.length" class="flex items-center gap-3">
				<a
					v-for="link in heroSocialLinks"
					:key="link.name"
					class="relative inline-flex h-9 w-9 items-center justify-center rounded-md p-2 transition-colors"
					:href="link.url"
					target="_blank"
					rel="noopener noreferrer"
					:title="link.title"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
						<path :class="link.iconClass" :d="link.icon" />
					</svg>
					<span class="sr-only">{{ link.label }}</span>
				</a>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AvatarPartial from '@partials/AvatarPartial.vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { SocialResponse } from '@api/response/index.ts';
import { useHeaderSocialLinks } from '@/support/social.ts';

const apiStore = useApiStore();

const social = ref<SocialResponse[]>([]);
const heroSocialLinks = useHeaderSocialLinks(social);

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
