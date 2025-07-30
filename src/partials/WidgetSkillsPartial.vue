<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="font-aspekta font-[650] mb-3">Technical/Personal Skills</div>
		<ul class="space-y-3">
			<li v-for="skill in props.skills" :key="skill.uuid" class="flex justify-between items-center">
				<div class="grow inline-flex mr-1 truncate">
					<span class="text-sky-500 mr-2">—</span> <a class="font-aspekta font-[650] text-sm truncate">{{ skill.item }}</a>
				</div>
				<div
					:class="`shrink-0 relative w-20 h-1.5 bg-slate-200 dark:bg-slate-700 before:absolute before:inset-0 before:bg-sky-500 before:w-[${skill.percentage}%]`"
					role="progressbar"
					:aria-valuenow="skill.percentage"
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import type { ProfileSkillResponse } from '@api/response/profile-response.ts';

const props = defineProps<{
	skills: ProfileSkillResponse[];
}>();
</script>
