<template>
	<a class="pill-button" :href="target">
		<span aria-hidden="true">{{ icon }}</span>
		{{ label }}
	</a>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = withDefaults(
	defineProps<{
		target: string;
		label?: string;
		icon?: string;
	}>(),
	{
		label: 'Back to top',
		icon: '↑',
	},
);

const { target, label, icon } = toRefs(props);
</script>
