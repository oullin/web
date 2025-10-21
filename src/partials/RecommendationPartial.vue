<template>
	<section class="space-y-8" :style="{ '--recommendations-section-min': recommendationsSectionMinHeight }">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Recommendations</h2>
			<BackToTopLink :target="backToTopTarget" />
		</div>
		<ul class="recommendations-list custom-scrollbar space-y-8">
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
import { computed, toRefs } from 'vue';
import DOMPurify from 'dompurify';
import BackToTopLink from '@partials/BackToTopLink.vue';
import PaginationControls from '@components/PaginationControls.vue';
import { image, date } from '@/public.ts';
import type { RecommendationsResponse } from '@api/response/recommendations-response.ts';
import { renderMarkdown } from '@/support/markdown.ts';
import { usePagination } from '@/support/pagination.ts';
import { Heights } from '@/support/heights.ts';

const props = defineProps<{
	recommendations: Array<RecommendationsResponse>;
	backToTopTarget: string;
}>();

const { recommendations, backToTopTarget } = toRefs(props);

const ITEMS_PER_PAGE = 3;

const recommendationsSectionMinHeight = `${Heights.resumeSectionMinHeights().recommendations.base}rem`;

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

const { currentPage, totalPages, paginatedItems: paginatedRecommendations, goToPreviousPage, goToNextPage } = usePagination(processedRecommendations, { itemsPerPage: ITEMS_PER_PAGE });
</script>
