<template>
	<div
		:class="[
			'relative aspect-video rounded-lg overflow-hidden bg-linear-to-tr from-slate-800 to-slate-700 odd:rotate-1 even:-rotate-1 hover:rotate-0 transition-transform duration-700 hover:duration-100 ease-in-out shadow-xl',
			animationClass,
		]"
		aria-hidden="true"
	>
		<div class="absolute inset-0 bg-slate-900/60"></div>
		<div class="h-full relative flex flex-col items-start justify-between before:content-[''] before:mt-auto before:flex-1 p-5">
			<div class="h-6 w-3/4 max-w-[220px] bg-white/30 rounded"></div>
			<div class="flex justify-end w-full">
				<div class="h-10 w-10 rounded-full bg-white/40"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ isAnimated?: boolean }>();

const animationClass = computed(() => ((props.isAnimated ?? true) ? 'animate-pulse' : null));
</script>
