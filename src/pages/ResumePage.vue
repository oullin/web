<template>
	<div class="max-w-7xl mx-auto">
		<div class="min-h-screen flex">
			<SideNavPartial />

			<!-- Main content -->
			<main class="blog-main-content">
				<div class="w-full h-full max-w-[1072px] mx-auto flex flex-col">
					<HeaderPartial />

					<!-- Content -->
					<div class="grow pt-12 md:pt-16 pb-16 md:pb-20">
						<!-- Main area -->
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
										<ResumePageSkeletonPartial :show-refresh-button="hasError" @retry="refreshResumePage" />
									</div>
									<div v-else class="space-y-12">
										<div v-if="education?.length" :class="resumeSectionHeights.education">
											<span id="education" class="block h-0" aria-hidden="true"></span>
											<EducationPartial :education="education" />
										</div>
										<div v-if="experience?.length" :class="resumeSectionHeights.experience">
											<span id="experience" class="block h-0" aria-hidden="true"></span>
											<ExperiencePartial :experience="experience" back-to-top-target="#resume-top" />
										</div>
										<div v-if="recommendations?.length" :class="resumeSectionHeights.recommendations">
											<span id="recommendations" class="block h-0" aria-hidden="true"></span>
											<RecommendationPartial :recommendations="recommendations" back-to-top-target="#resume-top" />
										</div>
									</div>
								</div>
							</section>
						</div>
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
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import ResumePageSkeletonPartial from '@partials/ResumePageSkeletonPartial.vue';

import { ref, onMounted, computed } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';
import type { EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';
import { Heights } from '@/support/heights';

const navigationItems = [
	{ href: '#education', text: 'Education' },
	{ href: '#experience', text: 'Work Experience' },
	{ href: '#recommendations', text: 'Recommendations' },
] as const;

const resumeSectionHeights = Heights.resumeSectionHeights();
const resumeSectionsTotalHeight = Heights.resumeSectionsTotalHeight();

const apiStore = useApiStore();
const isLoading = ref(true);
const hasError = ref(false);
const shouldShowSkeleton = computed(() => isLoading.value || hasError.value);
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
		const [experienceResponse, recommendationsResponse, educationResponse] = await Promise.all([apiStore.getExperience(), apiStore.getRecommendations(), apiStore.getEducation()]);

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
		hasError.value = true;
	} finally {
		isLoading.value = false;
	}
});

const refreshResumePage = () => {
	if (typeof window !== 'undefined') {
		window.location.reload();
	}
};
</script>
