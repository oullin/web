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
									<h1 class="h1 font-aspekta mb-12">Nice stuff I've built</h1>

									<!-- Page content -->
									<div class="space-y-10">
										<div class="mb-5">
											<p>
												Over the years, I’ve built and shared command-line tools and frameworks to tackle real engineering challenges—complete with clear docs and automated
												tests—and partnered with banks, insurers, and fintech to deliver custom software that balances performance, security, and scalability.
											</p>
											<p class="mt-2">
												Feel free to dive into my open-source repos and client case studies to see how I turn complex requirements into reliable, maintainable systems.
											</p>
										</div>
										<section>
											<h2 class="font-aspekta text-xl font-[650] mb-6">Open Source / Client Projects</h2>
											<div class="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
												<template v-if="isLoadingProjects || projects.length === 0">
													<ProjectCardSkeletonPartial v-for="index in 4" :key="`projects-page-skeleton-${index}`" :is-animated="isLoadingProjects" />
												</template>
												<template v-else>
													<ProjectCardPartial v-for="project in projects" :key="project.uuid" :item="project" />
												</template>
											</div>
										</section>
									</div>
								</section>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetSponsorPartial />
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
import { ref, onMounted } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import FooterPartial from '@partials/FooterPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import ProjectCardPartial from '@partials/ProjectCardPartial.vue';
import WidgetSkillsPartial from '@partials/WidgetSkillsPartial.vue';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import WidgetSkillsSkeletonPartial from '@partials/WidgetSkillsSkeletonPartial.vue';
import type { ProfileResponse, ProjectsResponse } from '@api/response/index.ts';
import ProjectCardSkeletonPartial from '@partials/ProjectCardSkeletonPartial.vue';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';

const apiStore = useApiStore();
const isLoadingProjects = ref(true);
const projects = ref<ProjectsResponse[]>([]);
const profile = ref<ProfileResponse | null>(null);
const isLoadingProfile = ref(true);

useSeo({
	title: 'Projects',
	image: ABOUT_IMAGE,
	url: siteUrlFor('/projects'),
	imageAlt: `${SITE_NAME} presenting a project`,
	keywords: buildKeywords('open source projects', 'software engineering portfolio', 'client project case studies'),
	description: `Explore some of ${SITE_NAME} open source and client projects built to solve real engineering challenges.`,
	jsonLd: [
		{
			name: 'Projects',
			'@type': 'CollectionPage',
			url: siteUrlFor('/projects'),
			'@context': 'https://schema.org',
			description: `A curated list of ${SITE_NAME} projects that highlight engineering leadership and architecture skills.`,
		},
		PERSON_JSON_LD,
	],
});

const loadProfile = async () => {
	try {
		const response = await apiStore.getProfile();

		if (response.data) {
			profile.value = response.data;
		}
	} catch (error) {
		debugError(error);
	} finally {
		isLoadingProfile.value = false;
	}
};

const loadProjects = async () => {
	try {
		const response = await apiStore.getProjects();

		if (response.data) {
			projects.value = response.data;
		}
	} catch (error) {
		debugError(error);
	} finally {
		isLoadingProjects.value = false;
	}
};

onMounted(async () => {
	await Promise.all([loadProfile(), loadProjects()]);
});
</script>
