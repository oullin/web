<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="flex items-center space-x-3 mb-2">
			<Skeleton class="h-6 w-6" />
			<Skeleton class="h-3 w-24" />
		</div>

		<ul role="list" class="mt-5 space-y-2">
			<li v-for="index in 4" :key="`social-skeleton-${index}`" class="flex items-center space-x-4">
				<Skeleton class="h-5 w-5" />
				<Skeleton class="h-4 w-20" />
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from '@components/ui/skeleton';
</script>
