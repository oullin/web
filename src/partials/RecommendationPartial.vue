<template>
	<section class="space-y-8">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Recommendations</h2>
			<BackToTopLink :target="backToTopTarget" />
		</div>
		<ul ref="recommendationsContainer" class="space-y-8">
			<!-- Item -->
			<li v-for="item in processedRecommendations" :key="item.uuid" class="group space-y-3">
				<div class="flex items-start gap-4">
					<div class="shrink-0 h-14 w-14 flex items-center justify-center rounded-full bg-white dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30">
						<img class="rounded-full" :src="image(item.person.avatar)" width="56" height="56" :alt="item.person.full_name" loading="lazy" decoding="async" fetchpriority="low" />
					</div>
					<div class="flex-1 min-w-0">
						<div class="font-aspekta font-[650] text-slate-800 dark:text-slate-100">{{ item.person.full_name }}</div>
						<div class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ item.person.company }}</div>
						<div v-if="item.person.designation" class="text-sm font-medium italic text-fuchsia-600 dark:text-slate-500">
							{{ item.person.designation }}
						</div>
					</div>
				</div>
				<div class="space-y-2 pl-[72px]">
					<div class="flex justify-between text-xs text-slate-500 dark:text-teal-600">
						<div>{{ item.relation }}</div>
						<div>{{ item.formattedDate }}</div>
					</div>
					<!-- eslint-disable-next-line vue/no-v-html -->
					<div class="post-markdown !text-sm !leading-normal !text-slate-500 dark:!text-slate-400" v-html="item.html"></div>
					<BackToTopLink variant="link" label="Go back to top" :target="backToTopTarget" />
				</div>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import { computed, toRefs, watch, nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import DOMPurify from 'dompurify';
import highlight from 'highlight.js/lib/core';
import BackToTopLink from '@partials/BackToTopLink.vue';
import { image, date } from '@/public.ts';
import type { RecommendationsResponse } from '@api/response/recommendations-response.ts';
import { initializeHighlighter, loadHighlightTheme, renderMarkdown } from '@/support/markdown.ts';
import { useDarkMode } from '@/dark-mode.ts';

const props = defineProps<{
	recommendations: Array<RecommendationsResponse>;
	backToTopTarget: string;
}>();

const { recommendations, backToTopTarget } = toRefs(props);
const { isDark } = useDarkMode();
const recommendationsContainer = ref<HTMLElement | null>(null);
const themeLink = ref<HTMLLinkElement | null>(null);

const processedRecommendations = computed(() => {
	return recommendations.value.map((item) => {
		const sanitisedHtml = DOMPurify.sanitize(renderMarkdown(item.text));

		return {
			...item,
			html: sanitisedHtml,
			formattedDate: date().format(new Date(item.created_at)),
		};
	});
});

watchEffect(() => {
	loadHighlightTheme(isDark.value, themeLink);
});

onUnmounted(() => {
	if (themeLink.value) {
		themeLink.value.remove();
		themeLink.value = null;
	}
});

watch(
	processedRecommendations,
	async (newRecommendations) => {
		if (!newRecommendations || newRecommendations.length === 0) {
			return;
		}

		await nextTick();
		await initializeHighlighter(highlight);

		const container = recommendationsContainer.value;
		if (!container) {
			return;
		}

		const blocks = container.querySelectorAll('pre code');
		blocks.forEach((block) => {
			highlight.highlightElement(block as HTMLElement);
		});
	},
	{ immediate: true },
);

onMounted(async () => {
	await initializeHighlighter(highlight);
});
</script>
