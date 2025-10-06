<template>
	<div class="relative overflow-hidden rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 shadow-sm ring-1 ring-inset ring-slate-200/70 dark:ring-slate-700/70" :class="[animationClass]">
		<img
			v-if="!isError && hasSource"
			class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
			:class="isLoaded ? 'opacity-100' : 'opacity-0'"
			:src="src"
			:alt="alt"
			:width="width"
			:height="height"
			:decoding="decoding"
			:fetchpriority="fetchpriority"
			:loading="loading"
			@load="handleLoad"
			@error="handleError"
		/>
		<div v-if="showSkeleton" class="absolute inset-0 flex items-center justify-center">
			<slot name="skeleton" :is-error="isError">
				<svg v-if="isError" class="w-10 h-10 text-slate-400 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15Z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="m3 14.25 3.955-3.955a2.25 2.25 0 0 1 3.182 0L15 15.75" />
					<path stroke-linecap="round" stroke-linejoin="round" d="m13.5 12 1.955-1.955a2.25 2.25 0 0 1 3.182 0L21 13.5" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 8.25h.008v.008H8.25z" />
				</svg>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = withDefaults(
	defineProps<{
		src?: string;
		alt: string;
		width?: number | string;
		height?: number | string;
		decoding?: 'async' | 'sync' | 'auto';
		fetchpriority?: 'high' | 'low' | 'auto';
		loading?: 'lazy' | 'eager';
	}>(),
	{
		src: '',
		decoding: 'async',
		fetchpriority: 'high',
	},
);

const emit = defineEmits<{
	load: [Event];
	error: [Event];
}>();

type ImageStatus = 'loading' | 'loaded' | 'error';

const imageStatus = ref<ImageStatus>('loading');

const hasSource = computed(() => Boolean(props.src));

const isLoaded = computed(() => imageStatus.value === 'loaded');
const isError = computed(() => imageStatus.value === 'error');
const showSkeleton = computed(() => imageStatus.value !== 'loaded');

const animationClass = computed(() => {
	if (imageStatus.value === 'loading') {
		return 'animate-pulse';
	}

	return 'animate-none';
});

const handleLoad = (event: Event) => {
	imageStatus.value = 'loaded';
	emit('load', event);
};

const handleError = (event: Event) => {
	imageStatus.value = 'error';
	emit('error', event);
};

watch(
	() => props.src,
	(newSrc, oldSrc) => {
		if (!newSrc) {
			imageStatus.value = 'error';
			return;
		}

		if (newSrc === oldSrc && imageStatus.value === 'loaded') {
			return;
		}

		imageStatus.value = 'loading';
	},
	{ immediate: true },
);
</script>
