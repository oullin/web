<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="font-aspekta font-[650] mb-3">Technical/Personal Skills</div>
		<TooltipProvider>
			<ul class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-3">
				<li v-for="skill in props.skills" :key="skill.uuid" class="flex items-center gap-x-4">
					<Tooltip>
						<TooltipTrigger as-child>
							<button type="button" class="grow cursor-pointer min-w-0 truncate text-left" :data-testid="`skill-name-trigger-${skill.uuid}`">
								<span class="text-fuchsia-500 dark:text-teal-500 mr-2">—</span>
								<span class="font-aspekta font-medium text-sm">{{ skill.item }}</span>
							</button>
						</TooltipTrigger>
						<TooltipContent>{{ skill.item }}</TooltipContent>
					</Tooltip>
					<Progress :model-value="skill.percentage" class="h-1.5 w-20 shrink-0" />
				</li>
			</ul>
		</TooltipProvider>
	</div>
</template>

<script setup lang="ts">
import type { ProfileSkillResponse } from '@api/response/profile-response.ts';
import { Progress } from '@components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';

const props = defineProps<{
	skills: ProfileSkillResponse[];
}>();
</script>
