<template>
	<div class="theme min-h-screen">
		<NavPartial />

		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">RESUME // EXPERIENCE // SYSTEMS</p>
					<h1 id="resume-top" class="page-title">My resume.</h1>
					<div class="page-copy">
						<p>This is the structured record behind the public work: education, experience, and recommendations from the people who have seen how I operate up close.</p>
					</div>
					<nav aria-label="Resume sections" class="page-anchor-nav">
						<a v-for="item in navigationItems" :key="item.href" :href="item.href">
							{{ item.text }}
						</a>
					</nav>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-stat-value">{{ profile ? profile.skills.length : '…' }}</div>
						<div class="page-stat-label">Active skills mapped from profile data</div>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">Operating Context</div>
						<div class="page-meta-list">
							<span><strong>Role:</strong> engineering leadership with hands-on depth</span>
							<span><strong>Style:</strong> architecture, delivery, mentoring</span>
							<span><strong>Bias:</strong> clear systems over theatrical complexity</span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="text-slate-500 dark:text-slate-400 relative">
					<div v-if="shouldShowSkeleton" key="skeleton" :class="['space-y-12', resumeSectionsTotalHeight]">
						<ResumePageSkeletonPartial :show-refresh-button="hasProfileError" @retry="refreshResumePage" />
					</div>
					<div v-else key="content" :class="['space-y-12', resumeSectionsTotalHeight]">
						<div :class="['page-summary-card', resumeSectionHeights.education]">
							<span id="education" class="block h-0" aria-hidden="true"></span>
							<EducationPartial v-if="education" :education="education" />
						</div>
						<div :class="['page-summary-card', resumeSectionHeights.experience]">
							<span id="experience" class="block h-0" aria-hidden="true"></span>
							<ExperiencePartial v-if="experience" :experience="experience" back-to-top-target="#resume-top" />
						</div>
						<div :class="['page-summary-card', resumeSectionHeights.recommendations]">
							<span id="recommendations" class="block h-0" aria-hidden="true"></span>
							<RecommendationPartial v-if="recommendations" :recommendations="recommendations" back-to-top-target="#resume-top" />
						</div>
					</div>
				</div>
				<div class="flex justify-end pt-10">
					<BackToTopLink target="#resume-top" />
				</div>
			</section>

			<section class="page-support-grid">
				<WidgetLangPartial />
				<WidgetSkillsTransitionWrapper :profile="profile" :is-loading="isLoadingProfile" />
				<div class="page-summary-card">
					<div class="page-section-label">Why this page exists</div>
					<div class="page-panel-title">A resume should be inspectable, not ornamental.</div>
					<p class="page-panel-copy">This section is meant to make experience legible: what was built, under what conditions, and with what level of trust from others.</p>
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import NavPartial from '@partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import EducationPartial from '@partials/EducationPartial.vue';
import ExperiencePartial from '@partials/ExperiencePartial.vue';
import BackToTopLink from '@partials/BackToTopLink.vue';
import WidgetLangPartial from '@partials/WidgetLangPartial.vue';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import ResumePageSkeletonPartial from '@partials/ResumePageSkeletonPartial.vue';
import WidgetSkillsTransitionWrapper from '@components/WidgetSkillsTransitionWrapper.vue';

import { ref, onMounted, computed } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';
import type { ProfileResponse, EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';
import { resumeSectionHeights as buildResumeSectionHeights, resumeSectionsTotalHeight as buildResumeSectionsTotalHeight } from '@/support/heights';

const navigationItems = [
	{ href: '#education', text: 'Education' },
	{ href: '#experience', text: 'Work Experience' },
	{ href: '#recommendations', text: 'Recommendations' },
] as const;

const resumeSectionHeights = buildResumeSectionHeights();
const resumeSectionsTotalHeight = buildResumeSectionsTotalHeight();

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
