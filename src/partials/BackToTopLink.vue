<template>
	<a
		class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-fuchsia-400/70 hover:text-slate-800 dark:border-slate-700/80 dark:text-slate-300 dark:hover:text-slate-100"
		:href="target"
	>
		<span aria-hidden="true">↑</span>
		Back to top
	</a>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = withDefaults(defineProps<{ target?: string }>(), { target: '#resume-top' });

const { target } = toRefs(props);
</script>
