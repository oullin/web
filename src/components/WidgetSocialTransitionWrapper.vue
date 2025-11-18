<template>
	<div class="relative min-h-[200px]">
		<WidgetSocialSkeletonPartial v-if="isLoading" key="skeleton" />
		<WidgetSocialPartial v-else key="social" :social="social" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import WidgetSocialSkeletonPartial from '@partials/WidgetSocialSkeletonPartial.vue';
import { Social, type SocialNavLink } from '@support/social.ts';

const socialService = new Social();
const social = ref<SocialNavLink[]>([]);
const isLoading = ref(true);

onMounted(async () => {
	const response = await socialService.fetch();
	social.value = socialService.buildNavLinks(response);
	isLoading.value = false;
});
</script>
