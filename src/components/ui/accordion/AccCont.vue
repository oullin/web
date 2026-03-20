<script setup lang="ts">
import type { AccordionContentProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AccordionContent, useForwardProps } from 'reka-ui';
import { cn } from '@components/lib/utils';

const props = defineProps<AccordionContentProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
	<AccordionContent data-slot="accordion-content" v-bind="forwardedProps" :class="cn('overflow-hidden text-sm', props.class)">
		<div class="pb-5 pt-1">
			<slot />
		</div>
	</AccordionContent>
</template>
