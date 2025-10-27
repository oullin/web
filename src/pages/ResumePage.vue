<template>
	<div class="max-w-7xl mx-auto">
		<div class="min-h-screen flex">
			<SideNavPartial />

			<!-- Main content -->
			<main class="blog-main-content">
				<div class="w-full h-full mx-auto flex flex-col max-w-5xl">
					<HeaderPartial />

					<!-- Content -->
					<div class="grow pt-12 md:pt-16 pb-16 md:pb-20">
						<!-- Main area -->
						<div class="w-full">
							<section>
								<!-- Page title -->
								<h1 id="resume-top" class="h1 font-aspekta mb-6">My resume</h1>

								<div class="text-base text-slate-500 dark:text-slate-400 space-y-2 mb-12">
									<p>
										I’m a hands-on Head of Engineering who turns complex ideas into dependable products. I build and scale teams that deliver, setting clear direction, de-risking
										delivery, and coaching people to perform at a high level.
									</p>
									<p>
										I cut through noise, fix what’s slow, simplify what’s messy, and ship fast without losing quality—keeping stakeholders aligned on outcomes while balancing
										product needs with operational excellence.
									</p>
								</div>

								<nav aria-label="Resume sections" class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mb-12">
									<a
										v-for="item in navigationItemsWithState"
										:key="item.href"
										:class="[navLinkBaseClasses, item.isActive ? navLinkActiveClasses : navLinkInactiveClasses]"
										:href="item.href"
										:aria-current="item.isActive ? 'location' : undefined"
										:data-active="item.isActive ? 'true' : undefined"
										@click="handleNavigationItemClick(item.id, $event)"
									>
										<span :class="[navIndicatorBaseClasses, item.isActive ? navIndicatorActiveClasses : navIndicatorInactiveClasses]"></span>
										{{ item.text }}
									</a>
								</nav>
								<!-- Page content -->
								<div class="text-slate-500 dark:text-slate-400">
									<div v-if="shouldShowSkeleton" :class="['space-y-12', resumeSectionsTotalHeight]">
										<ResumePageSkeletonPartial :show-refresh-button="hasError && !hasResumeContent" @retry="refreshResumePage" />
									</div>
									<div v-if="!isLoading" class="space-y-12">
										<div v-if="shouldShowPartialErrorRefresh" class="flex justify-center lg:justify-start" data-testid="resume-partial-error">
											<button type="button" class="btn bg-fuchsia-500 hover:bg-fuchsia-600 text-white shadow-sm" @click="refreshResumePage">Refresh page</button>
										</div>
										<div v-if="education?.length" :class="resumeSectionHeights.education" data-section-id="education" ref="educationSectionRef">
											<span id="education" class="block h-0" aria-hidden="true"></span>
											<EducationPartial :education="education" back-to-top-target="#resume-top" />
										</div>
										<div v-if="experience?.length" :class="resumeSectionHeights.experience" data-section-id="experience" ref="experienceSectionRef">
											<span id="experience" class="block h-0" aria-hidden="true"></span>
											<ExperiencePartial :experience="experience" back-to-top-target="#resume-top" />
										</div>
										<div v-if="recommendations?.length" :class="resumeSectionHeights.recommendations" data-section-id="recommendations" ref="recommendationsSectionRef">
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
import { Heights } from '@/support/heights';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import HeaderPartial from '@partials/HeaderPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import EducationPartial from '@partials/EducationPartial.vue';
import ExperiencePartial from '@partials/ExperiencePartial.vue';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import ResumePageSkeletonPartial from '@partials/ResumePageSkeletonPartial.vue';
import { ref, onMounted, computed, nextTick, onBeforeUnmount, watch } from 'vue';
import { observeSections, disconnectSectionsObserver } from '@/support/observer';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';
import type { EducationResponse, ExperienceResponse, RecommendationsResponse } from '@api/response/index.ts';

import { navigationItems, type SectionId, createNavigationItemsWithState, createResumeNavigation } from '@pages/support/resume.ts';

const navLinkBaseClasses = 'inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors hover:border-fuchsia-400/70 hover:text-slate-800 dark:hover:text-slate-100';
const navLinkActiveClasses = 'border-fuchsia-500 text-slate-800 dark:text-slate-100 dark:border-teal-500/80';
const navLinkInactiveClasses = 'border-slate-200/70 dark:border-slate-700/80';
const navIndicatorBaseClasses = 'size-2 rounded-full transition-colors';
const navIndicatorActiveClasses = 'bg-fuchsia-500 dark:bg-teal-400';
const navIndicatorInactiveClasses = 'bg-fuchsia-400/70 dark:bg-teal-500/80';

const resumeSectionHeights = Heights.resumeSectionHeights();
const resumeSectionsTotalHeight = Heights.resumeSectionsTotalHeight();

const apiStore = useApiStore();
const isLoading = ref(true);
const hasError = ref(false);
const activeSectionId = ref<SectionId>(navigationItems[0].id);
const education = ref<EducationResponse[] | null>(null);
const experience = ref<ExperienceResponse[] | null>(null);
const recommendations = ref<RecommendationsResponse[] | null>(null);
const educationSectionRef = ref<HTMLElement | null>(null);
const experienceSectionRef = ref<HTMLElement | null>(null);
const recommendationsSectionRef = ref<HTMLElement | null>(null);
const hasResumeContent = computed(() => Boolean(education.value?.length || experience.value?.length || recommendations.value?.length));
const shouldShowSkeleton = computed(() => isLoading.value || (hasError.value && !hasResumeContent.value));
const shouldShowPartialErrorRefresh = computed(() => hasError.value && hasResumeContent.value);

const navigationItemsWithState = createNavigationItemsWithState(activeSectionId);

const { handleNavigationItemClick, updateInitialActiveSection } = createResumeNavigation({
	activeSectionId,
	sectionRefs: {
		education: educationSectionRef,
		experience: experienceSectionRef,
		recommendations: recommendationsSectionRef,
	},
	getSectionsWithData: () => ({
		education: Boolean(education.value?.length),
		experience: Boolean(experience.value?.length),
		recommendations: Boolean(recommendations.value?.length),
	}),
});

watch(
	[education, experience, recommendations],
	() => {
		if (!education.value?.length && !experience.value?.length && !recommendations.value?.length) {
			return;
		}

		updateInitialActiveSection();
	},
	{ flush: 'post' },
);

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
	const [expRes, recRes, eduRes] = await Promise.allSettled([apiStore.getExperience(), apiStore.getRecommendations(), apiStore.getEducation()]);

	if (expRes.status === 'fulfilled' && expRes.value.data) {
		experience.value = expRes.value.data;
	} else if (expRes.status === 'rejected') {
		debugError(expRes.reason);
		hasError.value = true;
	}

	if (recRes.status === 'fulfilled' && recRes.value.data) {
		recommendations.value = recRes.value.data;
	} else if (recRes.status === 'rejected') {
		debugError(recRes.reason);
		hasError.value = true;
	}

	if (eduRes.status === 'fulfilled' && eduRes.value.data) {
		education.value = eduRes.value.data;
	} else if (eduRes.status === 'rejected') {
		debugError(eduRes.reason);
		hasError.value = true;
	}

	isLoading.value = false;
	updateInitialActiveSection();
	await nextTick();

	if (hasResumeContent.value && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
		observeSections(navigationItems, activeSectionId);
	}
});

const refreshResumePage = () => {
	if (typeof window !== 'undefined') {
		window.location.reload();
	}
};

onBeforeUnmount(() => {
	disconnectSectionsObserver();
});
</script>
