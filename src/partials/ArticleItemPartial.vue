<template>
	<article v-if="item" class="py-5 border-b border-slate-100 dark:border-slate-800 group">
		<div class="flex items-start">
			<router-link
				v-lazy-link
				class="relative block mr-4 sm:mr-6 flex-shrink-0 cursor-pointer grayscale transition duration-300 ease-out group-hover:grayscale-0 group-focus-within:grayscale-0 hover:grayscale-0 focus-visible:grayscale-0"
				:to="{ name: 'PostDetail', params: { slug: item.slug } }"
			>
				<CoverImageLoader
					class="block aspect-square w-20 sm:w-28 overflow-hidden rounded-lg bg-slate-200/80 dark:bg-slate-800/80 shadow-sm ring-1 ring-inset ring-slate-200/70 dark:ring-slate-700/70"
					:src="item.cover_image_url"
					:alt="item.title"
					:width="112"
					:height="112"
					loading="lazy"
					fetchpriority="low"
				>
					<template #skeleton="{ isError }">
						<svg
							v-if="isError"
							class="w-6 h-6 text-slate-400 dark:text-slate-600"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="m3 14.25 3.955-3.955a2.25 2.25 0 0 1 3.182 0L15 15.75" />
							<path stroke-linecap="round" stroke-linejoin="round" d="m13.5 12 1.955-1.955a2.25 2.25 0 0 1 3.182 0L21 13.5" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 8.25h.008v.008H8.25z" />
						</svg>
					</template>
				</CoverImageLoader>
			</router-link>
			<div>
				<div class="text-xs text-slate-700 uppercase mb-1 dark:text-slate-500">
					{{ date().format(new Date(item.published_at)) }}
				</div>
				<h3 class="text-slate-700 font-aspekta text-lg font-[650] mb-1 dark:text-slate-300">
					<router-link
						v-lazy-link
						class="inline-flex relative hover:text-fuchsia-500 dark:hover:text-teal-500 duration-150 ease-out before:scale-x-0 before:origin-center before:absolute before:inset-0 before:bg-sky-200 dark:before:bg-sky-500 before:opacity-30 before:-z-10 before:translate-y-1/4 before:-rotate-2 hover:before:scale-100 before:duration-150 before:ease-in-out"
						:to="{ name: 'PostDetail', params: { slug: item.slug } }"
					>
						{{ item.title }}
					</router-link>
				</h3>
				<div class="flex">
					<div class="grow text-sm text-slate-500 dark:text-slate-600">
						{{ item.excerpt }}
					</div>
					<router-link
						v-lazy-link
						class="hidden lg:flex shrink-0 text-fuchsia-500 dark:text-teal-500 items-center justify-center w-12 group"
						:to="{ name: 'PostDetail', params: { slug: item.slug } }"
						tabindex="-1"
					>
						<svg class="fill-current group-hover:translate-x-2 duration-150 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="14" height="12">
							<path d="M9.586 5 6.293 1.707 7.707.293 13.414 6l-5.707 5.707-1.414-1.414L9.586 7H0V5h9.586Z" />
						</svg>
					</router-link>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup lang="ts">
import CoverImageLoader from '@components/CoverImageLoader.vue';
import { date } from '@/public.ts';
import type { PostResponse } from '@api/response/index.ts';

defineProps<{
	item: PostResponse;
}>();
</script>
