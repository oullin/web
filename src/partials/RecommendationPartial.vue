<template>
	<section ref="recommendationsSection" class="page-editorial">
		<div class="page-editorial-sep"></div>
		<div class="page-editorial-row">
			<div class="space-y-3">
				<span class="page-section-label !mb-0">Recommendations</span>
			</div>
			<p class="page-panel-copy">People who have worked with Gustavo across architecture, delivery, and leadership.</p>
		</div>
		<TooltipProvider :delay-duration="90">
			<div ref="recommendationsContainer">
				<Accordion v-model="openRecommendation" type="single" collapsible class="w-full">
					<AccordionItem v-for="item in paginatedRecommendations" :key="item.uuid" :value="item.uuid" class="group">
						<AccordionTrigger hide-icon class="page-editorial-row py-7 hover:no-underline">
							<div class="flex items-start gap-3 pr-6">
								<Tooltip>
									<TooltipTrigger as-child>
										<span
											data-testid="recommendation-row-point"
											class="mt-[0.22rem] inline-flex size-2 shrink-0 cursor-pointer rounded-full bg-[var(--primary)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_12%,transparent)]"
										></span>
									</TooltipTrigger>
									<TooltipContent side="right">Read recommendation</TooltipContent>
								</Tooltip>
								<div class="min-w-0">
									<div class="page-section-label !mb-0 leading-relaxed">{{ item.person.full_name }}</div>
									<div class="mt-[0.35rem] text-[0.68rem] leading-none text-[var(--primary)] transition-colors duration-200 group-data-[state=open]:rotate-90">+</div>
								</div>
							</div>
							<div class="flex flex-1 items-start gap-4 text-left">
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
									<div class="page-panel-copy !text-[0.7rem] !text-[var(--text)]">
										<strong>{{ item.person.full_name }}</strong>
										<span class="text-[var(--muted)]"> / {{ item.person.company }}</span>
									</div>
									<div v-if="item.person.designation" class="page-panel-copy mt-1 !text-[0.66rem] !text-[var(--primary)]">
										{{ item.person.designation }}
									</div>
									<div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 page-panel-copy !text-[0.62rem] uppercase tracking-[0.16em]">
										<span>{{ item.relation }}</span>
										<span aria-hidden="true">/</span>
										<span>{{ item.formattedDate }}</span>
									</div>
								</div>
							</div>
						</AccordionTrigger>
						<AccordionContent class="pb-0">
							<div class="grid grid-cols-[160px_minmax(0,1fr)] gap-10 pb-7">
								<div></div>
								<div class="space-y-4 pl-16">
									<div class="post-markdown page-panel-copy !text-[0.7rem] !leading-[2] !text-[var(--muted)]" v-html="item.html"></div>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</TooltipProvider>
		<div v-if="totalPages > 1" class="page-editorial-row pt-7">
			<div class="page-panel-copy !text-[0.62rem] uppercase tracking-[0.16em]">Page {{ currentPage }} / {{ totalPages }}</div>
			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					class="page-panel-copy cursor-pointer border border-[var(--border)] px-3 py-2 uppercase tracking-[0.16em] transition-colors hover:border-[var(--primary)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40"
					:disabled="currentPage === 1"
					aria-label="Go to previous recommendations page"
					@click="goToPreviousPage"
				>
					Prev
				</button>
				<button
					v-for="pageNumber in totalPages"
					:key="pageNumber"
					type="button"
					class="page-panel-copy cursor-pointer border px-3 py-2 uppercase tracking-[0.16em] transition-colors hover:text-[var(--text)]"
					:class="pageNumber === currentPage ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--border)]'"
					:aria-label="`Go to recommendations page ${pageNumber}`"
					@click="goToPage(pageNumber)"
				>
					{{ pageNumber }}
				</button>
				<button
					type="button"
					class="page-panel-copy cursor-pointer border border-[var(--border)] px-3 py-2 uppercase tracking-[0.16em] transition-colors hover:border-[var(--primary)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40"
					:disabled="currentPage === totalPages"
					aria-label="Go to next recommendations page"
					@click="goToNextPage"
				>
					Next
				</button>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, toRefs, watch, nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import DOMPurify from 'dompurify';
import highlight from 'highlight.js/lib/core';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { image, date } from '@/public.ts';
import type { RecommendationsResponse } from '@api/response/recommendations-response.ts';
import { initializeHighlighter, loadHighlightTheme, renderMarkdown } from '@/support/markdown.ts';
import { useDarkMode } from '@/dark-mode.ts';

const PAGE_SIZE = 8;

const props = defineProps<{
	recommendations: Array<RecommendationsResponse>;
}>();

const { recommendations } = toRefs(props);
const { isDark } = useDarkMode();
const recommendationsSection = ref<HTMLElement | null>(null);
const recommendationsContainer = ref<HTMLElement | null>(null);
const themeLink = ref<HTMLLinkElement | null>(null);
const currentPage = ref(1);
const openRecommendation = ref<string>();

const processedRecommendations = computed(() => {
	return recommendations.value.map((item) => {
		const sanitisedHtml = DOMPurify.sanitize(renderMarkdown(item.text));

		return {
			...item,
			html: sanitisedHtml,
			formattedDate: date().format(new Date(item.created_at)),
		};
	});
});

const totalPages = computed(() => {
	return Math.max(1, Math.ceil(processedRecommendations.value.length / PAGE_SIZE));
});

const paginatedRecommendations = computed(() => {
	const start = (currentPage.value - 1) * PAGE_SIZE;
	return processedRecommendations.value.slice(start, start + PAGE_SIZE);
});

const scrollToRecommendationsStart = async () => {
	await nextTick();

	const section = recommendationsSection.value;
	if (!section || typeof section.scrollIntoView !== 'function') {
		return;
	}

	section.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const goToPage = async (pageNumber: number) => {
	const nextPage = Math.min(Math.max(1, pageNumber), totalPages.value);
	const didChangePage = nextPage !== currentPage.value;

	currentPage.value = nextPage;

	if (!didChangePage) {
		return;
	}

	await scrollToRecommendationsStart();
};

const goToPreviousPage = async () => {
	await goToPage(currentPage.value - 1);
};

const goToNextPage = async () => {
	await goToPage(currentPage.value + 1);
};

watch(totalPages, (pageCount) => {
	if (currentPage.value > pageCount) {
		currentPage.value = pageCount;
	}
});

watch(
	paginatedRecommendations,
	() => {
		openRecommendation.value = undefined;
	},
	{ immediate: true },
);

watchEffect(() => {
	loadHighlightTheme(isDark.value, themeLink);
});

onUnmounted(() => {
	if (themeLink.value) {
		themeLink.value.remove();
		themeLink.value = null;
	}
});

watch(
	paginatedRecommendations,
	async (newRecommendations) => {
		if (!newRecommendations || newRecommendations.length === 0) {
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
