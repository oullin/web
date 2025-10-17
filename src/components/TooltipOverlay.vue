<template>
	<Teleport to="body">
		<div
			v-if="tooltip.show"
			:style="{ top: tooltip.top, left: tooltip.left }"
			:class="['absolute -translate-x-1/2 -translate-y-full mt-[-8px] whitespace-nowrap text-white text-xs rounded-md py-1 px-3 z-50 bg-slate-900 dark:bg-slate-700', overlayClass]"
		>
			{{ tooltip.content }}
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import type { TooltipState } from '@/support/tooltips.ts';

type TooltipOverlayProps = {
	tooltip: TooltipState;
	overlayClass?: string;
};

withDefaults(defineProps<TooltipOverlayProps>(), {
	overlayClass: '',
});
</script>
