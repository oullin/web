<template>
	<div class="relative min-h-[18rem]">
		<transition name="fade" appear>
			<WidgetSkillsSkeletonPartial v-if="isLoading || !profile" key="skeleton" />
			<WidgetSkillsPartial v-else key="skills" :skills="profile.skills" />
		</transition>
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
