<template>
	<div
		:class="[
			'relative aspect-video rounded-lg overflow-hidden bg-linear-to-tr from-slate-800 to-slate-700 odd:rotate-1 even:-rotate-1 hover:rotate-0 transition-transform duration-700 hover:duration-100 ease-in-out shadow-xl',
			!props.isAnimated ? '' : 'animate-pulse',
		]"
		aria-hidden="true"
	>
		<div class="absolute inset-0 bg-slate-900/60"></div>
		<div class="h-full relative flex flex-col items-start justify-between before:content-[''] before:mt-auto before:flex-1 p-5">
			<Skeleton :class="['h-6 w-3/4 max-w-[220px] bg-white/30', !props.isAnimated && 'animate-none']" />
			<div class="flex justify-end w-full">
				<Skeleton :class="['h-10 w-10 rounded-full bg-white/40', !props.isAnimated && 'animate-none']" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from '@components/ui/skeleton';

const props = withDefaults(defineProps<{ isAnimated?: boolean }>(), { isAnimated: true });
</script>
