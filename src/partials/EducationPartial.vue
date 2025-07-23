<template>
	<div class="space-y-8">
		<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Education</h2>
		<ul class="space-y-8">
			<!-- Item -->
			<li v-for="item in processedEducation" :key="item.uuid" class="relative group">
				<div
					class="flex items-start before:absolute before:left-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 before:self-start before:ml-[28px] before:-translate-x-1/2 before:translate-y-8 group-last-of-type:before:hidden"
				>
					<div
						class="absolute left-0 h-14 w-14 flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
					>


						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="opacity-30 size-8 dark:opacity-30 fill-none text-fuchsia-500 dark:text-white"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
							/>
						</svg>

					</div>
					<div class="pl-20 space-y-1">
						<div class="text-xs text-slate-500 uppercase">Year <span class="text-slate-400 dark:text-slate-600">·</span> {{ item.graduated_at }}</div>
						<div class="font-aspekta font-[650] text-slate-800 dark:text-slate-100">{{ item.degree }}</div>
						<div class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ item.school }}</div>
						<!-- eslint-disable-next-line vue/no-v-html -->
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
import type { Education } from '@stores/users/userType.ts';

const { education } = defineProps<{
	education: Education[]
}>()

const processedEducation = computed(() => {
	return education.map(item => {
		const sanitisedHtml = DOMPurify.sanitize(marked.parse(item.description) as string);

		return {
			...item,
			html: sanitisedHtml,
		};
	});
});

</script>
