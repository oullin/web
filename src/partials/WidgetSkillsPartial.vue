<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="font-aspekta font-[650] mb-3">Technical/Personal Skills</div>
		<ul class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-3">
			<li v-for="skill in props.skills" :key="skill.uuid" class="flex items-center gap-x-4">
				<div class="grow cursor-pointer min-w-0 truncate" @mouseenter="showTooltip($event, skill.item)" @mouseleave="hideTooltip">
					<span class="text-fuchsia-500 dark:text-teal-500 mr-2">—</span>
					<a class="font-aspekta font-medium text-sm">{{ skill.item }}</a>
				</div>
				<div class="shrink-0 relative w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" role="progressbar" :aria-valuenow="skill.percentage" aria-valuemin="0" aria-valuemax="100">
					<div class="absolute inset-0 bg-fuchsia-300 dark:bg-teal-800 rounded-full" :style="{ width: `${skill.percentage}%` }"></div>
				</div>
			</li>
		</ul>
	</div>

	<Teleport to="body">
		<div
			v-if="tooltip.show"
			:style="{ top: tooltip.top, left: tooltip.left }"
			class="absolute -translate-x-1/2 -translate-y-full mt-[-8px] whitespace-nowrap text-white text-xs rounded-md py-1 px-3 z-50 bg-slate-900 dark:bg-slate-700"
		>
			{{ tooltip.content }}
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { ProfileSkillResponse } from '@api/response/profile-response.ts';

const props = defineProps<{
	skills: ProfileSkillResponse[];
}>();

interface TooltipState {
	show: boolean;
	content: string;
	top: string;
	left: string;
}

const tooltip: Ref<TooltipState> = ref({
	show: false,
	content: '',
	top: '0px',
	left: '0px',
});

const showTooltip = (event: MouseEvent, skillItem: string): void => {
	const el = event.currentTarget as HTMLElement;
	const rect = el.getBoundingClientRect();

	tooltip.value = {
		show: true,
		content: skillItem,
		top: `${window.scrollY + rect.top}px`,
		left: `${window.scrollX + rect.left + rect.width / 2}px`,
	};
};

const hideTooltip = (): void => {
	tooltip.value.show = false;
};
</script>
