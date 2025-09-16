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
										<EducationPartial v-if="education" :education="education" />
										<ExperiencePartial v-if="experience" :experience="experience" />
										<RecommendationPartial v-if="recommendations" :recommendations="recommendations" />
									</div>
								</section>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetLangPartial />
								<WidgetSkillsPartial v-if="profile" :skills="profile.skills" />
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
import FooterPartial from '@partials/FooterPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import EducationPartial from '@partials/EducationPartial.vue';
import ExperiencePartial from '@partials/ExperiencePartial.vue';
import WidgetLangPartial from '@partials/WidgetLangPartial.vue';
import WidgetSkillsPartial from '@partials/WidgetSkillsPartial.vue';
import RecommendationPartial from '@partials/RecommendationPartial.vue';

import { ref, onMounted } from 'vue';
import { useApiStore } from '@api/store.ts';
import { seo, SITE_NAME } from '@/support/seo';
import ogImage from '@images/profile/about.jpg';
import { debugError } from '@api/http-error.ts';
import type { ProfileResponse, EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const education = ref<EducationResponse[] | null>(null);
const experience = ref<ExperienceResponse[] | null>(null);
const recommendations = ref<RecommendationsResponse[] | null>(null);

seo.apply({
	title: 'Resume',
	description: `Explore the experience, education, and recommendations of ${SITE_NAME}.`,
	image: ogImage,
});

onMounted(async () => {
	try {
		const [profileResponse, experienceResponse, recommendationsResponse, educationResponse] = await Promise.all([
			apiStore.getProfile(),
			apiStore.getExperience(),
			apiStore.getRecommendations(),
			apiStore.getEducation(),
		]);

		if (profileResponse.data) {
			profile.value = profileResponse.data;
		}

		if (experienceResponse.data) {
			experience.value = experienceResponse.data;
		}

		if (recommendationsResponse.data) {
			recommendations.value = recommendationsResponse.data;
		}

		if (educationResponse.data) {
			education.value = educationResponse.data;
		}
	} catch (error) {
		debugError(error);
	}
});
</script>
