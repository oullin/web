<template>
	<section class="space-y-8">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Recommendations</h2>
			<a
				class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-fuchsia-400/70 hover:text-slate-800 dark:border-slate-700/80 dark:text-slate-300 dark:hover:text-slate-100"
				href="#resume-top"
			>
				<span aria-hidden="true">↑</span>
				Back to top
			</a>
		</div>
		<ul class="space-y-8">
			<!-- Item -->
			<li v-for="item in processedRecommendations" :key="item.uuid" class="relative group">
				<div class="flex items-start">
					<div
						class="absolute left-0 h-14 w-14 flex items-center justify-center dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
					>
						<img class="rounded-full" :src="image(item.person.avatar)" width="56" height="56" :alt="item.person.full_name" loading="lazy" decoding="async" fetchpriority="low" />
					</div>
					<div class="pl-20 space-y-1">
						<div class="font-aspekta font-[650] text-slate-800 dark:text-slate-100">{{ item.person.full_name }}</div>
						<div class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ item.person.company }}</div>
						<div class="flex justify-between text-xs dark:text-teal-500 text-slate-400 pb-2">
							<div>{{ item.relation }}</div>
							<div>{{ item.formattedDate }}</div>
						</div>
						<!-- eslint-disable-next-line vue/no-v-html -->
						<div class="text-sm text-slate-500 dark:text-slate-400" v-html="item.html"></div>
					</div>
				</div>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DOMPurify from 'dompurify';
import { image, date } from '@/public.ts';
import type { RecommendationsResponse } from '@api/response/recommendations-response.ts';
import { renderMarkdown } from '@/support/markdown.ts';

const { recommendations } = defineProps<{
	recommendations: Array<RecommendationsResponse>;
}>();

const processedRecommendations = computed(() => {
	return recommendations.map((item) => {
		const sanitisedHtml = DOMPurify.sanitize(renderMarkdown(item.text));

		return {
			...item,
			html: sanitisedHtml,
			formattedDate: date().format(new Date(item.created_at)),
		};
	});
});
</script>
