<template>
	<section class="space-y-8">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Recommendations</h2>
			<BackToTopLink :target="backToTopTarget" />
		</div>
		<ul class="space-y-8">
			<!-- Item -->
			<li v-for="item in paginatedRecommendations" :key="item.uuid" class="relative group">
				<div class="flex items-start">
					<div
						class="absolute left-0 h-14 w-14 flex items-center justify-center dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
					>
						<img class="rounded-full" :src="image(item.person.avatar)" width="56" height="56" :alt="item.person.full_name" loading="lazy" decoding="async" fetchpriority="low" />
					</div>
					<div class="pl-20 space-y-1">
						<div class="font-aspekta font-[650] text-slate-800 dark:text-slate-100">{{ item.person.full_name }}</div>
						<div class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ item.person.company }}</div>
						<div v-if="item.person.designation" class="text-sm font-medium italic text-fuchsia-600 dark:text-slate-500">
							{{ item.person.designation }}
						</div>
						<div class="flex justify-between text-xs dark:text-teal-600 text-slate-500 pb-2">
							<div>{{ item.relation }}</div>
							<div>{{ item.formattedDate }}</div>
						</div>
						<!-- eslint-disable-next-line vue/no-v-html -->
						<div class="text-sm text-slate-500 dark:text-slate-400" v-html="item.html"></div>
					</div>
				</div>
			</li>
		</ul>
		<PaginationControls
			:current-page="currentPage"
			:total-pages="totalPages"
			aria-label="Recommendations pagination"
			previous-label="Previous"
			next-label="Next"
			@previous="goToPreviousPage"
			@next="goToNextPage"
		/>
	</section>
</template>

<script setup lang="ts">
import { computed, toRefs, ref, watch } from 'vue';
import DOMPurify from 'dompurify';
import BackToTopLink from '@partials/BackToTopLink.vue';
import PaginationControls from '@components/PaginationControls.vue';
import { image, date } from '@/public.ts';
import type { RecommendationsResponse } from '@api/response/recommendations-response.ts';
import { renderMarkdown } from '@/support/markdown.ts';

const props = defineProps<{
	recommendations: Array<RecommendationsResponse>;
	backToTopTarget: string;
}>();

const { recommendations, backToTopTarget } = toRefs(props);

const ITEMS_PER_PAGE = 3;

const currentPage = ref(1);

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

const totalPages = computed(() => Math.max(1, Math.ceil(processedRecommendations.value.length / ITEMS_PER_PAGE)));

const paginatedRecommendations = computed(() => {
	const start = (currentPage.value - 1) * ITEMS_PER_PAGE;

	return processedRecommendations.value.slice(start, start + ITEMS_PER_PAGE);
});

const isFirstPage = computed(() => currentPage.value === 1);
const isLastPage = computed(() => currentPage.value === totalPages.value);

watch(
	processedRecommendations,
	(items) => {
		if (!items.length) {
			currentPage.value = 1;

			return;
		}

		if (currentPage.value > totalPages.value) {
			currentPage.value = totalPages.value;
		}
	},
	{ immediate: true },
);

const goToPreviousPage = () => {
	if (!isFirstPage.value) {
		currentPage.value -= 1;
	}
};

const goToNextPage = () => {
	if (!isLastPage.value) {
		currentPage.value += 1;
	}
};
</script>
