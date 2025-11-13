<template>
	<a :class="variantClasses" :href="target" @click.prevent="handleClick">
		<span aria-hidden="true">{{ icon }}</span>
		{{ label }}
	</a>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

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

const { target, label, icon, variant } = toRefs(props);

const variantClasses = computed(() => {
	const baseClasses = 'inline-flex items-center gap-2 text-sm font-medium transition-colors';

	if (variant.value === 'link') {
		return `${baseClasses} text-fuchsia-600 hover:text-fuchsia-500 dark:text-teal-400 dark:hover:text-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300/80`;
	}

	return `${baseClasses} rounded-full border border-slate-200/70 px-4 py-2 text-slate-600 hover:border-fuchsia-400/70 hover:text-slate-800 dark:border-slate-700/80 dark:text-slate-300 dark:hover:text-slate-100`;
});

const handleClick = () => {
	if (typeof window === 'undefined') {
		return;
	}

	const targetElement = document.querySelector<HTMLElement>(target.value);

	if (!targetElement) {
		return;
	}

	targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>
