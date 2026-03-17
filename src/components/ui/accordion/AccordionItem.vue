<script setup lang="ts">
import type { AccordionItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AccordionItem, useForwardProps } from 'reka-ui';
import { cn } from '@components/lib/utils';

const props = defineProps<AccordionItemProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
	<AccordionItem data-slot="accordion-item" v-bind="forwardedProps" :class="cn('border-b border-[var(--border)] last:border-b-0', props.class)">
		<slot />
	</AccordionItem>
</template>
