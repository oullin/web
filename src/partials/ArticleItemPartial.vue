<template>
        <article v-if="item" class="py-5 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-start">
                        <div
                                class="relative rounded-sm w-16 h-16 sm:w-[88px] sm:h-[88px] mr-6 overflow-hidden bg-slate-200 dark:bg-slate-800"
                                :class="imageError ? 'animate-none' : showSkeleton ? 'animate-pulse' : 'animate-none'"
                        >
                                <img
                                        v-if="!imageError"
                                        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                                        :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
                                        :src="item.cover_image_url"
                                        width="88"
                                        height="88"
                                        :alt="item.title"
                                        decoding="async"
                                        loading="lazy"
                                        @load="handleImageLoad"
                                        @error="handleImageError"
                                />
                                <div v-if="showSkeleton" class="absolute inset-0 flex items-center justify-center">
                                        <svg
                                                v-if="imageError"
                                                class="w-6 h-6 text-slate-400 dark:text-slate-600"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                        >
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                </div>
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
import { computed, ref, watch } from 'vue';
import { date } from '@/public.ts';
import type { PostResponse } from '@api/response/index.ts';

const props = defineProps<{
        item: PostResponse;
}>();

const imageLoaded = ref(false);
const imageError = ref(false);

const handleImageLoad = () => {
        imageLoaded.value = true;
};

const handleImageError = () => {
        imageError.value = true;
        imageLoaded.value = true;
};

const showSkeleton = computed(() => !imageLoaded.value || imageError.value);

watch(
        () => props.item?.cover_image_url,
        (newSrc) => {
                if (!newSrc) {
                        imageLoaded.value = true;
                        imageError.value = true;
                        return;
                }

                imageLoaded.value = false;
                imageError.value = false;
        },
        { immediate: true },
);
</script>
