<template>
	<section class="space-y-8">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-300">Work Experience</h2>
			<BackToTopLink :target="backToTopTarget" />
		</div>
		<ul class="space-y-8">
			<!-- Item -->
			<li v-for="item in props.experience" :key="item.uuid" class="relative group">
				<div
					class="flex items-start before:absolute before:left-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 before:self-start before:ml-[28px] before:-translate-x-1/2 before:translate-y-8 group-last-of-type:before:hidden"
				>
					<div
						class="absolute left-0 h-14 w-14 flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							fill="currentColor"
							class="opacity-30 size-8 dark:opacity-30 fill-none text-fuchsia-500 dark:text-white"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
							/>
						</svg>
					</div>
					<div class="pl-20 space-y-1">
						<div class="text-xs text-slate-500 uppercase">{{ item.start_date }} <span class="text-slate-400 dark:text-slate-600">·</span> {{ item.end_date }}</div>
						<div class="font-aspekta font-[650] text-slate-700 dark:text-slate-100">{{ item.position }}</div>
						<div class="text-sm font-medium text-slate-700 dark:text-slate-100">{{ item.company }}</div>
						<div class="text-sm text-slate-500 dark:text-slate-400">{{ item.summary }}</div>
						<div class="text-xs mt-3 text-gray-400 dark:text-gray-500">
							{{ item.skills }}
						</div>
					</div>
				</div>
			</li>
		</ul>
	</section>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
import BackToTopLink from '@partials/BackToTopLink.vue';
import type { ExperienceResponse } from '@api/response/index.ts';

const props = defineProps<{
	experience: Array<ExperienceResponse>;
	backToTopTarget: string;
}>();

const { backToTopTarget } = toRefs(props);
</script>
