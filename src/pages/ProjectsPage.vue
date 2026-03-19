<template>
	<div class="theme min-h-screen projects-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">BANKING // CONSULTING // SYSTEMS</p>
					<h1 id="projects-top" class="page-title">Proof from real systems.</h1>
					<div class="page-copy">
						<p>
							This portfolio reflects work shaped by banking, consulting, product teams, and resilient software delivery. It includes open-source tools, internal platforms, and client
							systems built for availability, security, maintainability, and change.
						</p>
						<p>&nbsp;</p>
						<p>These projects show how architecture, delivery, and product judgement come together when the software has to keep working after launch.</p>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-stat-value">{{ isLoadingProjects ? '…' : totalProjects }}</div>
						<div class="page-stat-label">Projects currently indexed</div>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">Focus</div>
						<div class="page-meta-list">
							<span><strong>Domains:</strong> banking, insurance, SaaS, product</span>
							<span><strong>Systems:</strong> high-trust, resilient, maintainable</span>
							<span><strong>Lens:</strong> architecture, delivery, modernisation</span>
						</div>
					</div>
				</div>
			</section>

			<section ref="projectsSection" class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">Selected Work</span>
						<h2 class="page-section-title">Work inspected through an engineering lens.</h2>
					</div>
					<p class="page-lead">The point is not novelty. It is evidence of judgement across architecture, product delivery, and systems that need to keep working after launch.</p>
				</div>

				<div class="relative min-h-[25rem] mt-8">
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

const skeletonCount = computed(() => {
	return projects.value.length > 0 ? projects.value.length : pageSize.value;
});

useSeo({
	title: 'Projects',
	image: SEO_IMAGE,
	url: siteUrlFor('/projects'),
	imageAlt: `${SITE_NAME} project collection preview`,
	keywords: buildKeywords(
		'open source tools',
		'client systems',
		'software delivery',
		'platform architecture',
		'software architecture',
		'technical management',
		'digital transformation',
		'AI transformation',
		'banking insurance SaaS',
	),
	description: `Explore open-source tools, internal platforms, and client systems from ${SITE_NAME}, showing depth across banking, consulting, product delivery, and resilient software.`,
	jsonLd: [
		{
			name: 'Projects',
			'@type': 'CollectionPage',
			url: siteUrlFor('/projects'),
			'@context': 'https://schema.org',
			description: `Selected open-source and client projects from ${SITE_NAME} across banking, consulting, product delivery, and resilient production systems.`,
		},
		ORGANIZATION_JSON_LD,
	],
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
