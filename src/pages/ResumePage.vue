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
                                                                        <h1 class="h1 font-aspekta mb-6 md:mb-8">My resume</h1>

                                                                        <nav
                                                                                class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 mb-10"
                                                                                aria-label="Resume sections"
                                                                        >
                                                                                <a
                                                                                        class="transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                                                                                        href="#education"
                                                                                >
                                                                                        Education
                                                                                </a>
                                                                                <span class="text-slate-300 dark:text-slate-700">·</span>
                                                                                <a
                                                                                        class="transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                                                                                        href="#work-experience"
                                                                                >
                                                                                        Work experience
                                                                                </a>
                                                                                <span class="text-slate-300 dark:text-slate-700">·</span>
                                                                                <a
                                                                                        class="transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                                                                                        href="#recommendations"
                                                                                >
                                                                                        Recommendations
                                                                                </a>
                                                                        </nav>

                                                                        <!-- Page content -->
                                                                        <div class="text-slate-500 dark:text-slate-400 space-y-12">
                                                                                <section id="education" class="scroll-mt-24">
                                                                                        <EducationPartial v-if="education" :education="education" />
                                                                                </section>
                                                                                <section id="work-experience" class="scroll-mt-24">
                                                                                        <ExperiencePartial v-if="experience" :experience="experience" />
                                                                                </section>
                                                                                <section id="recommendations" class="scroll-mt-24">
                                                                                        <RecommendationPartial v-if="recommendations" :recommendations="recommendations" />
                                                                                </section>
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
import { debugError } from '@api/http-error.ts';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';
import type { ProfileResponse, EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const education = ref<EducationResponse[] | null>(null);
const experience = ref<ExperienceResponse[] | null>(null);
const recommendations = ref<RecommendationsResponse[] | null>(null);

useSeo({
	title: 'Resume',
	image: ABOUT_IMAGE,
	url: siteUrlFor('/resume'),
	imageAlt: `${SITE_NAME} professional portrait`,
	description: `Explore the experience, education, and recommendations of ${SITE_NAME}.`,
	keywords: buildKeywords('software engineering resume', 'technology leadership experience', 'engineering manager CV'),
	jsonLd: [
		{
			name: 'Resume',
			'@type': 'ProfilePage',
			url: siteUrlFor('/resume'),
			'@context': 'https://schema.org',
			description: `${SITE_NAME} resume showcasing education, experience, and recommendations.`,
		},
		PERSON_JSON_LD,
	],
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
