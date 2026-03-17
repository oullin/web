<template>
	<div class="relative min-h-[200px]">
		<WidgetSocialSkeletonPartial v-if="isLoading" key="skeleton" />
		<WidgetSocialPartial v-else key="social" :links="links" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import WidgetSocialSkeletonPartial from '@partials/WidgetSocialSkeletonPartial.vue';
import { Links, type LinksNavLink } from '@support/links.ts';

const linksService = new Links();
const links = ref<LinksNavLink[]>([]);
const isLoading = ref(true);

onMounted(async () => {
	const response = await linksService.fetch();
	links.value = linksService.buildNavLinks(response, ['linkedin', 'x']);
	isLoading.value = false;
});
</script>
