<template>
	<div class="max-w-7xl mx-auto">
		<div class="min-h-screen flex">
			<SideNavPartial />

			<!-- Main content -->
			<main class="grow overflow-hidden px-6">
				<div class="w-full h-full max-w-[1072px] mx-auto flex flex-col">
					<HeaderPartial />

					<!-- Content -->
					<div class="grow md:flex space-y-8 md:space-y-0 md:space-x-8 pt-12 md:pt-16 pb-16 md:pb-20">
						<!-- Middle area -->
						<div class="grow">
							<div class="max-w-[700px]">
								<section>
									<!-- Page title -->
									<h1 class="h1 font-aspekta mb-12">My resume</h1>
									<!-- Page content -->
									<div class="text-slate-500 dark:text-slate-400 space-y-12">
										<RecommendationPartial />
										<AwardsPartial />
										<EducationPartial />
										<ExperiencePartial v-if="user" :experience="user.experience" />
									</div>
								</section>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetSkillsPartial />
								<WidgetLangPartial />
								<WidgetReferencesPartial />
							</div>
						</aside>
					</div>

					<FooterPartial />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import HeaderPartial from '@partials/HeaderPartial.vue';
import AwardsPartial from '@partials/AwardsPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import EducationPartial from '@partials/EducationPartial.vue';
import ExperiencePartial from '@partials/ExperiencePartial.vue';
import WidgetLangPartial from '@partials/WidgetLangPartial.vue';
import WidgetSkillsPartial from '@partials/WidgetSkillsPartial.vue';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import WidgetReferencesPartial from '@partials/WidgetReferencesPartial.vue';

import { ref, onMounted } from 'vue';
import type { User } from '@stores/users/userType';
import { useUserStore } from '@stores/users/user.ts';

const userStore = useUserStore();
const user: User = ref<User | null>(null);

onMounted(() => {
	userStore.onBoot((profile: User) => {
		user.value = profile;
	});
});
</script>
