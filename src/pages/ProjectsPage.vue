<template>
	<div class="theme min-h-screen">
		<NavPartial />

		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">OPEN SOURCE // SYSTEMS // DELIVERY</p>
					<h1 id="projects-top" class="page-title">Nice stuff I've built.</h1>
					<div class="page-copy">
						<p>
							Over the years, I’ve built command-line tools, frameworks, internal platforms, and client systems for teams that needed performance, security, and maintainability at the
							same time.
						</p>
						<p>These projects reflect a mix of open-source work, architecture experiments, and product delivery across banking, insurance, and SaaS.</p>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-stat-value">{{ isLoadingProjects ? '…' : projects.length }}</div>
						<div class="page-stat-label">Projects currently indexed</div>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">Focus</div>
						<div class="page-meta-list">
							<span><strong>Open source:</strong> reusable engineering tools</span>
							<span><strong>Client systems:</strong> high-trust production delivery</span>
							<span><strong>Bias:</strong> practical architecture over demo work</span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">Selected Work</span>
						<h2 class="page-section-title">Open source and client systems shaped for real constraints.</h2>
					</div>
					<p class="page-lead">
						Each project below is meant to be inspected, not just glanced at. The goal is to show systems thinking, product judgment, and the kind of execution that holds up after launch.
					</p>
				</div>

				<div class="relative min-h-[25rem] mt-8">
					<div v-if="isLoadingProjects" key="loading" data-testid="projects-skeleton-grid" class="blog-projects-grid">
						<ProjectCardSkeletonPartial v-for="index in skeletonCount" :key="`projects-page-skeleton-${index}`" :is-animated="isLoadingProjects && projects.length === 0" />
					</div>
					<p v-else-if="hasError" key="error" class="page-empty-state">Something went wrong loading projects. Please try again later.</p>
					<div v-else-if="projects.length > 0" key="projects" class="blog-projects-grid">
						<ProjectCardPartial v-for="project in projects" :key="project.uuid" :item="project" />
					</div>
					<p v-else key="empty" class="page-empty-state">Projects will be added soon. Check back later!</p>
				</div>

				<div class="flex justify-end pt-10">
					<BackToTopLink target="#projects-top" />
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import NavPartial from '@partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import ProjectCardPartial from '@partials/ProjectCardPartial.vue';
import BackToTopLink from '@partials/BackToTopLink.vue';
import type { ProjectsResponse } from '@api/response/index.ts';
import ProjectCardSkeletonPartial from '@partials/ProjectCardSkeletonPartial.vue';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';

const apiStore = useApiStore();
const isLoadingProjects = ref(true);
const hasError = ref(false);
const projects = ref<ProjectsResponse[]>([]);

const skeletonCount = computed(() => {
	return projects.value.length > 0 ? projects.value.length : 4;
});

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

const loadProjects = async () => {
	try {
		const response = await apiStore.getProjects();

		if (response.data) {
			projects.value = response.data;
		}
	} catch (error) {
		debugError(error);
		hasError.value = true;
	} finally {
		isLoadingProjects.value = false;
	}
};

onMounted(async () => {
	await loadProjects();
});
</script>
