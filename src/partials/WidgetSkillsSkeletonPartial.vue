<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<Skeleton class="h-5 w-48 max-w-full mb-3" />
		<ul class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-3">
			<li v-for="index in 6" :key="`skill-skeleton-${index}`" class="flex items-center gap-x-4">
				<div class="grow flex items-center gap-x-2 min-w-0">
					<span class="h-3 w-3 rounded-full bg-fuchsia-200/60 dark:bg-teal-900/60"></span>
					<Skeleton class="h-4 w-3/4 max-w-[140px]" />
				</div>
				<Skeleton class="shrink-0 h-1.5 w-20 rounded-full" />
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from '@components/ui/skeleton';
</script>
