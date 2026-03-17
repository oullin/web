<script setup lang="ts">
import type { AccordionTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ChevronDown } from 'lucide-vue-next';
import { AccordionHeader, AccordionTrigger, useForwardProps } from 'reka-ui';
import { cn } from '@components/lib/utils';

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes['class']; hideIcon?: boolean }>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
	<AccordionHeader class="flex">
		<AccordionTrigger
			data-slot="accordion-trigger"
			v-bind="forwardedProps"
			:class="
				cn(
					'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
					props.class,
				)
			"
		>
			<slot />
			<ChevronDown v-if="!props.hideIcon" class="size-4 shrink-0 text-[var(--muted)] transition-transform duration-200" />
		</AccordionTrigger>
	</AccordionHeader>
</template>
