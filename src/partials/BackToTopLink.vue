<template>
	<Button
		as="a"
		:variant="props.variant === 'link' ? 'ghost' : 'outline'"
		size="sm"
		:class="[
			props.variant === 'link'
				? 'hover:bg-transparent hover:text-fuchsia-500 dark:text-teal-800 dark:hover:text-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300/80'
				: 'rounded-full border-slate-200/70 text-slate-600 hover:border-fuchsia-400/70 hover:bg-transparent hover:text-slate-800 dark:border-slate-700/80 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-transparent',
		]"
		:href="props.target"
		@click="handleClick"
	>
		<span aria-hidden="true">{{ props.icon }}</span>
		{{ props.label }}
	</Button>
</template>

<script setup lang="ts">
import { Button } from '@components/ui/button';

const props = withDefaults(
	defineProps<{
		target: string;
		label?: string;
		icon?: string;
		variant?: 'button' | 'link';
	}>(),
	{
		label: 'Back to top',
		icon: '↑',
		variant: 'button',
	},
);

const handleClick = (event: Event) => {
	if (typeof window === 'undefined') {
		return;
	}

	let targetElement: HTMLElement | null = null;

	try {
		targetElement = document.querySelector<HTMLElement>(props.target);
	} catch {
		return;
	}

	if (!targetElement) {
		return;
	}

	event.preventDefault();
	targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>
