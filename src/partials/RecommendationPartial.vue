<template>
	<div class="space-y-8">
		<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Recommendations</h2>
		<ul class="space-y-8">
			<!-- Item -->
			<li class="relative group" v-for="item in recommendations" :key="item.uuid">
				<div class="flex items-start">
					<div
						class="absolute left-0 h-14 w-14 flex items-center justify-center dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
					>
						<img class="rounded-full" :src="image(item.person.avatar)" width="56" height="56" alt="Testimonial 03" />
					</div>
					<div class="pl-20 space-y-1">
						<div class="font-aspekta font-[650] text-slate-800 dark:text-slate-100">{{ item.person.full_name }}</div>
						<div class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ item.person.company }}</div>
						<div>
							<div>{{ item.relation }}</div>
							<div>{{ item.created_at }}</div>
						</div>
						<div class="text-sm text-slate-500 dark:text-slate-400">
							{{ item.text }}
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import type { Recommendation } from '@stores/users/userType.ts';
import { image } from '@/public.ts';

defineProps<{
	recommendations: Recommendation[]
}>()
</script>
