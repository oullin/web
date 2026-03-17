<template>
	<div class="space-y-6" aria-hidden="true" data-testid="recommendations-dialog-skeleton">
		<div v-for="item in 3" :key="`recommendation-dialog-skeleton-${item}`" class="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-5">
			<div class="flex items-start gap-4">
				<Skeleton class="h-12 w-12 rounded-full" />
				<div class="min-w-0 flex-1 space-y-3">
					<Skeleton class="h-4 w-2/3 max-w-[220px]" />
					<Skeleton class="h-4 w-1/2 max-w-[160px]" />
					<div class="flex flex-wrap gap-2">
						<Skeleton class="h-3 w-20" />
						<Skeleton class="h-3 w-16" />
					</div>
					<div class="space-y-2 pt-2">
						<Skeleton class="h-3 w-full" />
						<Skeleton class="h-3 w-11/12" />
						<Skeleton class="h-3 w-4/5" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from '@components/ui/skeleton';
</script>
