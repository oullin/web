<template>
	<a
		v-lazy-link
		class="rounded-lg border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 transition-color ease-in-out p-5 group"
		:href="item.url"
		target="_blank"
		rel="noopener noreferrer"
	>
		<div class="project-card-content">
			<div class="grow">
				<div class="flex items-center justify-between space-x-2">
					<div class="h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-full mb-2">
						<img :src="getIconSrc()" width="18" height="18" :alt="item.title" loading="lazy" decoding="async" fetchpriority="low" />
					</div>
					<div v-if="item.is_open_source" class="text-xs inline-flex items-center font-medium bg-green-100 text-green-600 rounded-full text-center px-2 h-5">Open-Source</div>
				</div>
				<div class="text-lg font-aspekta font-[650] mb-1">{{ item.title }}</div>
				<p class="text-sm text-slate-500 dark:text-slate-400 mb-2">{{ item.excerpt }}</p>
			</div>
			<div class="text-sky-500 dark:text-teal-500 flex justify-end">
				<svg class="fill-current -rotate-45 group-hover:rotate-0 transition-transform ease-out" xmlns="http://www.w3.org/2000/svg" width="14" height="12">
					<path d="M9.586 5 6.293 1.707 7.707.293 13.414 6l-5.707 5.707-1.414-1.414L9.586 7H0V5h9.586Z" />
				</svg>
			</div>
		</div>
	</a>
</template>

<script setup lang="ts">
import { image, getRandomInt } from '@/public.ts';
import { ProjectsResponse } from '@api/response/index.ts';

const { item } = defineProps<{
	item: ProjectsResponse;
}>();

const getIconSrc = (): string => {
	const seed = getRandomInt(1, 8);

	//example: 'icons/icon-06.svg'
	const path = `icons/icon-0${seed}.svg`;

	return image(path);
};
</script>
