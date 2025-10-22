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
									<h1 id="resume-top" class="h1 font-aspekta mb-6">My resume</h1>

									<nav aria-label="Resume sections" class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mb-12">
										<a
											v-for="item in navigationItems"
											:key="item.href"
											class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-700/80 px-4 py-2 transition-colors hover:border-fuchsia-400/70 hover:text-slate-800 dark:hover:text-slate-100"
											:href="item.href"
										>
											<span class="size-2 rounded-full bg-fuchsia-400/70 dark:bg-teal-500/80"></span>
											{{ item.text }}
										</a>
									</nav>
									<!-- Page content -->
									<div class="text-slate-500 dark:text-slate-400">
										<div v-if="shouldShowSkeleton" :class="['space-y-12', resumeSectionsTotalHeight]">
											<ResumePageSkeletonPartial :show-refresh-button="hasProfileError" @retry="refreshResumePage" />
										</div>
										<div v-else class="space-y-12">
											<div :class="resumeSectionHeights.education">
												<span id="education" class="block h-0" aria-hidden="true"></span>
												<EducationPartial v-if="education" :education="education" />
											</div>
											<div :class="resumeSectionHeights.experience">
												<span id="experience" class="block h-0" aria-hidden="true"></span>
												<ExperiencePartial v-if="experience" :experience="experience" back-to-top-target="#resume-top" />
											</div>
											<div :class="resumeSectionHeights.recommendations">
												<span id="recommendations" class="block h-0" aria-hidden="true"></span>
												<RecommendationPartial v-if="recommendations" :recommendations="recommendations" back-to-top-target="#resume-top" />
											</div>
										</div>
									</div>
								</section>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetLangPartial />
								<WidgetSkillsSkeletonPartial v-if="isLoadingProfile || !profile" />
								<WidgetSkillsPartial v-else :skills="profile.skills" />
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
import WidgetSkillsSkeletonPartial from '@partials/WidgetSkillsSkeletonPartial.vue';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import ResumePageSkeletonPartial from '@partials/ResumePageSkeletonPartial.vue';

import { ref, onMounted, computed } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';
import type { ProfileResponse, EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';
import { Heights } from '@/support/heights';

const navigationItems = [
	{ href: '#education', text: 'Education' },
	{ href: '#experience', text: 'Work Experience' },
	{ href: '#recommendations', text: 'Recommendations' },
] as const;

const resumeSectionMinHeights = Heights.resumeSectionMinHeights();
const resumeSectionHeights = Heights.resumeSectionHeights();
const resumeSectionsTotalHeight = Heights.resumeSectionsTotalHeight();

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const isLoadingProfile = ref(true);
const hasProfileError = ref(false);
const shouldShowSkeleton = computed(() => isLoadingProfile.value || hasProfileError.value);
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
		hasProfileError.value = true;
	} finally {
		isLoadingProfile.value = false;
	}
});

const refreshResumePage = () => {
	if (typeof window !== 'undefined') {
		window.location.reload();
	}
};
</script>
