<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="font-aspekta font-[650] mb-3">Technical/Personal Skills</div>
		<ul class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-3">
			<li v-for="skill in props.skills" :key="skill.uuid" class="flex items-center gap-x-4">
				<div class="grow cursor-pointer min-w-0 truncate" @mouseenter="showTooltip($event, skill.item)" @mouseleave="hideTooltip">
					<span class="text-fuchsia-500 dark:text-teal-500 mr-2">—</span>
					<span class="font-aspekta font-medium text-sm">{{ skill.item }}</span>
				</div>
				<div class="shrink-0 relative w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" role="progressbar" :aria-valuenow="skill.percentage" aria-valuemin="0" aria-valuemax="100">
					<div class="absolute inset-0 bg-fuchsia-300 dark:bg-teal-800 rounded-full" :style="{ width: `${skill.percentage}%` }"></div>
				</div>
			</li>
		</ul>
	</div>

	<TooltipOverlay :tooltip="tooltip" />
</template>

<script setup lang="ts">
import type { ProfileSkillResponse } from '@api/response/profile-response.ts';
import { useTooltip } from '@/support/tooltips.ts';
import TooltipOverlay from '@components/TooltipOverlay.vue';

const props = defineProps<{
	skills: ProfileSkillResponse[];
}>();

const { tooltip, showTooltip, hideTooltip } = useTooltip();
</script>
