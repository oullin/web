<template>
	<NavPartial />
	<router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useApiStore } from '@api/store.ts';
import NavPartial from '@partials/NavPartial.vue';

const apiStore = useApiStore();

onMounted(() => {
	apiStore.boot();
});
</script>
