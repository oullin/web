<template>
	<div class="space-y-8">
		<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Recommendations</h2>
		<ul class="space-y-8">
			<!-- Item -->
			<li class="relative group" v-for="item in processedRecommendations" :key="item.uuid">
				<div class="flex items-start">
					<div
						class="absolute left-0 h-14 w-14 flex items-center justify-center dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
					>
						<img class="rounded-full" :src="image(item.person.avatar)" width="56" height="56" alt="Testimonial 03" />
					</div>
					<div class="pl-20 space-y-1">
						<div class="font-aspekta font-[650] text-slate-800 dark:text-slate-100">{{ item.person.full_name }}</div>
						<div class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ item.person.company }}</div>
						<div class="flex justify-between text-xs dark:text-teal-500 text-slate-400 pb-2 ">
							<div>{{ item.relation }}</div>
							<div>{{ item.formattedDate }}</div>
						</div>
						<div class="text-sm text-slate-500 dark:text-slate-400" v-html="item.html"></div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { image, date } from '@/public.ts';
import type { Recommendation } from '@stores/users/userType.ts';


marked.use({
	breaks: true,
	gfm: true,
});

const { recommendations } = defineProps<{
	recommendations: Recommendation[]
}>()

const processedRecommendations = computed(() => {
	return recommendations.map(item => {
		const sanitisedHtml = DOMPurify.sanitize(marked.parse(item.text) as string);

		return {
			...item,
			html: sanitisedHtml,
			formattedDate: date().format(new Date(item.created_at)),
		};
	});
});

</script>
