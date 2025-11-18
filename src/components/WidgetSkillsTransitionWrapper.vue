<template>
	<div class="relative min-h-[18rem]">
		<WidgetSkillsSkeletonPartial v-if="isLoading || !profile" key="skeleton" />
		<WidgetSkillsPartial v-else key="skills" :skills="profile.skills" />
	</div>
</template>

<script setup lang="ts">
import WidgetSkillsPartial from '@partials/WidgetSkillsPartial.vue';
import WidgetSkillsSkeletonPartial from '@partials/WidgetSkillsSkeletonPartial.vue';
import type { ProfileResponse } from '@api/response/index.ts';

defineProps<{
	isLoading: boolean;
	profile: ProfileResponse | null;
}>();
</script>
