<template>
	<section class="page-editorial">
		<div class="page-editorial-row">
			<div class="space-y-3">
				<span class="page-section-label !mb-0">Recommendations</span>
			</div>
			<div class="flex flex-col items-start gap-5">
				<p class="page-panel-copy">
					<Dialog>
						<DialogTrigger as-child>
							<button type="button" class="blog-link cursor-pointer bg-transparent p-0 text-left" data-testid="recommendations-dialog-trigger" @click="handleDialogOpen">
								{{ recommendationsContent.triggerLabel }}
							</button>
						</DialogTrigger>
						{{ recommendationsContent.intro }}

						<DialogContent
							:show-close-button="false"
							class="max-h-[85vh] w-[96vw] max-w-[calc(100%-2rem)] overflow-clip flex flex-col border-[var(--border)] bg-[var(--bg)] p-0 sm:max-w-[96vw] xl:max-w-[98vw]"
							aria-labelledby="recommendations-dialog-title"
						>
							<!-- Header — always visible -->
							<div class="flex items-start justify-between border-b border-[var(--border)] bg-[var(--bg)] px-8 py-6 lg:px-10">
								<div class="space-y-2 pr-4">
									<div class="page-section-label !mb-0">{{ recommendationsContent.dialog.sectionLabel }}</div>
									<DialogTitle id="recommendations-dialog-title" class="page-panel-title !text-xl">{{ recommendationsContent.dialog.title }}</DialogTitle>
									<p class="page-panel-copy !text-[var(--muted)]">{{ recommendationsContent.dialog.description }}</p>
								</div>
								<DialogClose as-child>
									<button
										type="button"
										class="ml-4 cursor-pointer text-[var(--muted)] transition hover:text-[var(--text)] focus:outline-none"
										data-testid="recommendations-dialog-close-button"
									>
										<span class="sr-only">Close</span>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5" aria-hidden="true">
											<path
												fill-rule="evenodd"
												d="M10 8.586 4.95 3.536A1 1 0 1 0 3.536 4.95L8.586 10l-5.05 5.05a1 1 0 0 0 1.414 1.414L10 11.414l5.05 5.05a1 1 0 0 0 1.414-1.414L11.414 10l5.05-5.05A1 1 0 0 0 15.05 3.536L10 8.586Z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
								</DialogClose>
							</div>

							<!-- Scrollable body — accordion only -->
							<div class="custom-scrollbar flex-1 min-h-0 overflow-y-auto">
								<div class="px-8 py-8 lg:px-10">
									<RecommendationDialogSkeletonPartial v-if="isDialogAnimating || isLoadingRecommendations" :count="PAGE_SIZE" />
									<p v-else-if="hasRecommendationsError" class="page-panel-copy" data-testid="recommendations-dialog-error">
										Recommendations are currently unavailable. Please try again later.
									</p>
									<p v-else-if="processedRecommendations.length === 0" class="page-panel-copy" data-testid="recommendations-dialog-empty">
										Recommendations will be added soon. Please check again later.
									</p>
									<div v-else ref="recommendationsContainer">
										<Accordion v-model="openRecommendation" type="single" collapsible class="rounded-2xl">
											<AccordionItem
												v-for="item in paginatedRecommendations"
												:key="item.uuid"
												:value="item.uuid"
												class="bg-transparent px-5"
												data-testid="recommendation-accordion-item"
											>
												<AccordionTrigger class="py-5 hover:no-underline">
													<div class="flex min-w-0 flex-1 items-start gap-4 pr-4 text-left">
														<div class="shrink-0 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)]">
															<img
																class="h-full w-full rounded-full object-cover"
																:src="image(item.person.avatar)"
																width="48"
																height="48"
																:alt="item.person.full_name"
																loading="lazy"
																decoding="async"
																fetchpriority="low"
															/>
														</div>
														<div class="min-w-0 flex-1">
															<div class="page-panel-copy !text-[var(--text)]">
																<strong>{{ item.person.full_name }}</strong>
																<span class="text-[var(--muted)]"> / {{ item.person.company }}</span>
															</div>
															<div v-if="item.person.designation" class="page-panel-copy mt-1 text-sm !text-[var(--primary)]">
																{{ item.person.designation }}
															</div>
															<div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 page-panel-copy text-xs uppercase tracking-[0.14em]">
																<span>{{ item.relation }}</span>
																<span aria-hidden="true">/</span>
																<span>{{ item.formattedDate }}</span>
															</div>
														</div>
													</div>
												</AccordionTrigger>
												<AccordionContent class="pb-0">
													<div class="pl-16" data-testid="recommendation-accordion-content">
														<div class="post-markdown prose dark:prose-invert page-panel-copy !text-[var(--muted)]" v-html="item.html"></div>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</div>
								</div>
							</div>

							<!-- Pagination footer — always visible -->
							<div
								v-if="showPagination"
								class="flex flex-col gap-4 border-t border-[var(--border)] px-8 py-4 md:flex-row md:items-center md:justify-between lg:px-10"
								data-testid="recommendations-dialog-pagination"
							>
								<div class="page-panel-copy text-xs uppercase tracking-[0.14em]">Page {{ currentPage }} / {{ totalPages }}</div>
								<Pagination :page="currentPage" :total="totalPages" :items-per-page="1" class="w-auto justify-end" @update:page="goToPage">
									<PaginationContent v-slot="{ items }" data-testid="recommendations-dialog-pagination-controls">
										<PaginationPrevious aria-label="Go to previous recommendations page" />
										<div class="flex flex-wrap items-center gap-2" data-testid="recommendations-dialog-pagination-pages">
											<template v-for="item in items" :key="item.type === 'page' ? `recommendation-page-${item.value}` : `recommendation-ellipsis-${item.key}`">
												<PaginationItem
													v-if="item.type === 'page'"
													:value="item.value"
													:is-active="item.value === currentPage"
													:aria-label="`Go to recommendations page ${item.value}`"
												>
													{{ item.value }}
												</PaginationItem>
												<PaginationEllipsis v-else />
											</template>
										</div>
										<PaginationNext aria-label="Go to next recommendations page" />
									</PaginationContent>
								</Pagination>
							</div>
						</DialogContent>
					</Dialog>
				</p>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import DOMPurify from 'dompurify';
import highlight from 'highlight.js/lib/core';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@components/ui/pagination';
import type { RecommendationsResponse } from '@api/response/recommendations-response.ts';
import { useApiStore } from '@api/store.ts';
import RecommendationDialogSkeletonPartial from '@partials/RecommendationDialogSkeletonPartial.vue';
import { useDarkMode } from '@/dark-mode.ts';
import { image, date } from '@/public.ts';
import { siteContent } from '@support/content.ts';
import { initializeHighlighter, loadHighlightTheme, renderMarkdown } from '@support/markdown.ts';

const PAGE_SIZE = 8;

const apiStore = useApiStore();
const { isDark } = useDarkMode();
const recommendationsContent = siteContent.recommendations;
const recommendations = ref<RecommendationsResponse[]>([]);
const recommendationsContainer = ref<HTMLElement | null>(null);
const themeLink = ref<HTMLLinkElement | null>(null);
const currentPage = ref(1);
const openRecommendation = ref<string>('');
const isLoadingRecommendations = ref(false);
const isDialogAnimating = ref(false);
const hasLoadedRecommendations = ref(false);
const hasRecommendationsError = ref(false);

let animationTimer: ReturnType<typeof setTimeout> | null = null;

const processedRecommendations = computed(() =>
	recommendations.value.map((item) => ({
		...item,
		html: DOMPurify.sanitize(renderMarkdown(item.text)),
		formattedDate: date().format(new Date(item.created_at)),
	})),
);

const totalPages = computed(() => Math.max(1, Math.ceil(processedRecommendations.value.length / PAGE_SIZE)));
const paginatedRecommendations = computed(() => {
	const start = (currentPage.value - 1) * PAGE_SIZE;
	return processedRecommendations.value.slice(start, start + PAGE_SIZE);
});
const showPagination = computed(() => !isDialogAnimating.value && !isLoadingRecommendations.value && !hasRecommendationsError.value && processedRecommendations.value.length > PAGE_SIZE);

const ensureRecommendationsLoaded = async () => {
	if (isLoadingRecommendations.value || hasLoadedRecommendations.value) {
		return;
	}

	isLoadingRecommendations.value = true;
	hasRecommendationsError.value = false;

	try {
		const response = await apiStore.getRecommendations();
		recommendations.value = response.data ?? [];
		hasLoadedRecommendations.value = true;
	} catch {
		hasRecommendationsError.value = true;
	} finally {
		isLoadingRecommendations.value = false;
	}
};

const resetDialogState = () => {
	currentPage.value = 1;
	openRecommendation.value = '';
};

const handleDialogOpen = () => {
	resetDialogState();
	isDialogAnimating.value = true;
	if (animationTimer) clearTimeout(animationTimer);
	animationTimer = setTimeout(() => {
		isDialogAnimating.value = false;
	}, 150);
	void ensureRecommendationsLoaded();
};

const goToPage = (pageNumber: number) => {
	currentPage.value = Math.min(Math.max(1, pageNumber), totalPages.value);
	openRecommendation.value = '';
};

watch(totalPages, (pageCount) => {
	if (currentPage.value > pageCount) {
		currentPage.value = pageCount;
	}
});

watchEffect(() => {
	loadHighlightTheme(isDark.value, themeLink);
});

onUnmounted(() => {
	if (themeLink.value) {
		themeLink.value.remove();
		themeLink.value = null;
	}
	if (animationTimer) clearTimeout(animationTimer);
});

watch(
	paginatedRecommendations,
	async (newRecommendations) => {
		if (!newRecommendations || newRecommendations.length === 0 || isLoadingRecommendations.value || hasRecommendationsError.value) {
			return;
		}

		await nextTick();
		await initializeHighlighter(highlight);

		const container = recommendationsContainer.value;
		if (!container) {
			return;
		}

		const blocks = container.querySelectorAll('pre code');
		blocks.forEach((block) => {
			highlight.highlightElement(block as HTMLElement);
		});
	},
	{ immediate: true },
);

onMounted(async () => {
	await initializeHighlighter(highlight);
});
</script>
