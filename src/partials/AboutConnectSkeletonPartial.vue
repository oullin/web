<template>
	<div data-testid="about-connect-skeleton" class="space-y-3 min-h-[25rem]" aria-hidden="true">
		<Skeleton class="h-4 w-48 max-w-full" />
		<Skeleton class="h-4 w-full max-w-[460px]" />
		<Skeleton class="h-4 w-2/3 max-w-[280px]" />
	</div>
</template>

<script setup lang="ts">
import { Skeleton } from '@components/ui/skeleton';
</script>
