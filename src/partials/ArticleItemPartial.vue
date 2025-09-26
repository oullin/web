<template>
	<article v-if="item" class="py-5 border-b border-slate-100 dark:border-slate-800">
		<div class="flex items-start">
			<div class="relative mr-6 w-16 h-16 sm:w-[88px] sm:h-[88px] shrink-0">
				<div v-if="!isImageLoaded" class="absolute inset-0 rounded-sm bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
				<img
					class="rounded-sm w-full h-full object-cover transition-opacity duration-300"
					:class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
					:src="item.cover_image_url"
					width="88"
					height="88"
					:alt="item.title"
					decoding="async"
					loading="lazy"
					@load="onImageLoad"
					@error="onImageError"
				/>
			</div>
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
import { ref } from 'vue';

import { date } from '@/public.ts';
import type { PostResponse } from '@api/response/index.ts';

defineProps<{
	item: PostResponse;
}>();

const isImageLoaded = ref(false);

const onImageLoad = () => {
	isImageLoaded.value = true;
};

const onImageError = () => {
	isImageLoaded.value = true;
};
</script>
