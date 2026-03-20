<template>
	<div class="theme min-h-screen projects-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">{{ hero.kicker }}</p>
					<h1 id="projects-top" class="page-title">{{ hero.title }}</h1>
					<div class="page-copy">
						<p v-for="(paragraph, index) in hero.copy" :key="paragraph" :class="{ 'mt-6': index > 0 }">{{ paragraph }}</p>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-stat-value">{{ isLoadingProjects ? '…' : totalProjects }}</div>
						<div class="page-stat-label">{{ sidebar.statsLabel }}</div>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.focus.label }}</div>
						<div class="page-meta-list">
							<!-- Trusted HTML from repo-owned fixtures only. Do not source this from user input or external data. -->
							<span v-for="item in sidebar.focus.items" :key="item" v-html="item"></span>
						</div>
					</div>
				</div>
			</section>

			<section ref="projectsSection" class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">{{ intro.label }}</span>
						<h2 class="page-section-title">{{ intro.title }}</h2>
					</div>
				</div>

				<div class="relative min-h-100 mt-8">
					<div v-if="isLoadingProjects" key="loading" data-testid="projects-skeleton-grid" class="blog-projects-grid">
						<ProjectCardSkeletonPartial v-for="index in skeletonCount" :key="`projects-page-skeleton-${index}`" :is-animated="isLoadingProjects && projects.length === 0" />
					</div>
					<p v-else-if="hasError" key="error" class="page-empty-state">Something went wrong loading projects. Please try again later.</p>
					<div v-else-if="projects.length > 0" key="projects" class="blog-projects-grid">
						<ProjectCardPartial v-for="project in projects" :key="project.uuid" :item="project" />
					</div>
					<p v-else key="empty" class="page-empty-state">Projects will be added soon. Please check again later.</p>
				</div>

				<div v-if="!isLoadingProjects && !hasError && totalPages > 1" class="page-editorial-row pt-7" data-testid="projects-pagination">
					<div class="page-panel-copy text-xs uppercase tracking-[0.14em]">Page {{ currentPage }} / {{ totalPages }}</div>
					<Pagination :page="currentPage" :total="totalPages" :items-per-page="1" :disabled="isLoadingProjects" class="w-auto justify-end" @update:page="goToPage">
						<PaginationContent v-slot="{ items }">
							<PaginationPrevious aria-label="Go to previous projects page" />
							<template v-for="item in items" :key="item.type === 'page' ? `projects-page-${item.value}` : `projects-ellipsis-${item.key}`">
								<PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === currentPage" :aria-label="`Go to projects page ${item.value}`">
									{{ item.value }}
								</PaginationItem>
								<PaginationEllipsis v-else />
							</template>
							<PaginationNext aria-label="Go to next projects page" />
						</PaginationContent>
					</Pagination>
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
import FooterPartial from '@partials/FooterPartial.vue';
import ProjectCardPartial from '@partials/ProjectCardPartial.vue';
import type { ProjectsCollectionResponse, ProjectsResponse } from '@api/response/index.ts';
import ProjectCardSkeletonPartial from '@partials/ProjectCardSkeletonPartial.vue';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@components/ui/pagination';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, ORGANIZATION_JSON_LD } from '@support/seo';
import { resolveJsonLdArray } from '@support/json-ld.ts';
import { projectsPageContent } from '@support/content/projects-page.ts';

const DEFAULT_SKELETON_COUNT = 4;
const apiStore = useApiStore();
const isLoadingProjects = ref(true);
const hasError = ref(false);
const projects = ref<ProjectsResponse[]>([]);
const projectsSection = ref<HTMLElement | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const totalProjects = ref(0);
const pageSize = ref(DEFAULT_SKELETON_COUNT);
let lastRequestId = 0;
const { hero, sidebar, intro, seo } = projectsPageContent;

const skeletonCount = computed(() => {
	return projects.value.length > 0 ? projects.value.length : pageSize.value;
});

useSeo({
	title: seo.title,
	image: SEO_IMAGE,
	url: siteUrlFor('/projects'),
	imageAlt: seo.imageAlt ?? `${SITE_NAME} project collection preview`,
	keywords: buildKeywords(seo.keywords),
	description: seo.description,
	jsonLd: [...resolveJsonLdArray(seo.jsonLd, siteUrlFor), ORGANIZATION_JSON_LD],
});

const scrollToProjectsStart = async () => {
	const section = projectsSection.value;

	if (!section || typeof section.scrollIntoView !== 'function') {
		return;
	}

	section.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const loadProjects = async (page = 1) => {
	const requestId = ++lastRequestId;
	hasError.value = false;
	try {
		const response: ProjectsCollectionResponse = await apiStore.getProjects(page);

		if (requestId !== lastRequestId) {
			return;
		}

		if (response.data) {
			projects.value = response.data;
		}

		currentPage.value = response.page || page;
		totalPages.value = Math.max(1, response.total_pages || 1);
		totalProjects.value = response.total || response.data.length;
		pageSize.value = response.page_size || DEFAULT_SKELETON_COUNT;
	} catch (error) {
		debugError(error);
		if (requestId !== lastRequestId) {
			return;
		}
		hasError.value = true;
	} finally {
		if (requestId === lastRequestId) {
			isLoadingProjects.value = false;
		}
	}
};

const goToPage = async (pageNumber: number) => {
	const nextPage = Math.min(Math.max(1, pageNumber), totalPages.value);

	if (nextPage === currentPage.value || isLoadingProjects.value) {
		return;
	}

	isLoadingProjects.value = true;
	await loadProjects(nextPage);
	await scrollToProjectsStart();
};

onMounted(async () => {
	await loadProjects(currentPage.value);
});
</script>
