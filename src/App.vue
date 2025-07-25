<template>
	<router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useApiStore } from '@api/store.ts';

const apiStore = useApiStore();

onMounted(() => {
	apiStore.boot();
});
</script>
