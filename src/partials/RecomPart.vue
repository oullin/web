<template>
	<section class="page-editorial">
		<div class="page-editorial-row">
			<div class="space-y-3">
				<span class="page-section-label mb-0!">Recommendations</span>
			</div>
			<div class="flex flex-col items-start gap-5">
				<p class="page-panel-copy">
					<Dialog>
						<DialogTrigger as-child>
							<button type="button" class="blog-link cursor-pointer bg-transparent p-0 text-left" data-testid="recommendations-dialog-trigger" @click="openDlg">
								{{ recsText.triggerLabel }}
							</button>
						</DialogTrigger>
						{{ recsText.intro }}

						<DialogContent
							:show-close-button="false"
							class="max-h-[85vh] w-[96vw] max-w-[calc(100%-2rem)] overflow-clip flex flex-col border-(--border) bg-(--bg) p-0 sm:max-w-[96vw] xl:max-w-[98vw]"
							aria-labelledby="recommendations-dialog-title"
						>
							<!-- Header — always visible -->
							<div class="flex items-start justify-between border-b border-(--border) bg-(--bg) px-8 py-6 lg:px-10">
								<div class="space-y-2 pr-4">
									<div class="page-section-label mb-0!">{{ recsText.dialog.sectionLabel }}</div>
									<DialogTitle id="recommendations-dialog-title" class="page-panel-title text-xl!">{{ recsText.dialog.title }}</DialogTitle>
									<p class="page-panel-copy text-(--muted)!">{{ recsText.dialog.description }}</p>
								</div>
								<DialogClose as-child>
									<button
										type="button"
										class="ml-4 cursor-pointer text-(--muted) transition hover:text-(--text) focus:outline-none"
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
									<RecommendationDialogSkeletonPartial v-if="isPrep" :count="PAGE_SIZE" />
									<p v-else-if="hasErr" class="page-panel-copy" data-testid="recommendations-dialog-error">Recommendations are currently unavailable. Please try again later.</p>
									<p v-else-if="readyRecs.length === 0" class="page-panel-copy" data-testid="recommendations-dialog-empty">
										Recommendations will be added soon. Please check again later.
									</p>
									<div v-else ref="recsWrap">
										<Accordion v-model="openRec" type="single" collapsible class="rounded-2xl">
											<AccordionItem v-for="item in pageRecs" :key="item.uuid" :value="item.uuid" class="bg-transparent px-5" data-testid="recommendation-accordion-item">
												<AccordionTrigger class="py-5 hover:no-underline">
													<div class="flex min-w-0 flex-1 items-start gap-4 pr-4 text-left">
														<div class="shrink-0 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-(--border) bg-(--surface)">
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
															<div class="page-panel-copy text-(--text)!">
																<strong>{{ item.person.full_name }}</strong>
																<span class="text-(--muted)"> / {{ item.person.company }}</span>
															</div>
															<div v-if="item.person.designation" class="page-panel-copy mt-1 text-sm text-(--primary)!">
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
														<div class="post-markdown prose dark:prose-invert page-panel-copy text-(--muted)!" v-html="item.html"></div>
													</div>
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									</div>
								</div>
							</div>

							<!-- Pagination footer — always visible -->
							<div
								v-if="showPages"
								class="flex flex-col gap-4 border-t border-(--border) px-8 py-4 md:flex-row md:items-center md:justify-between lg:px-10"
								data-testid="recommendations-dialog-pagination"
							>
								<div class="page-panel-copy text-xs uppercase tracking-[0.14em]">Page {{ curPage }} / {{ totalPages }}</div>
								<Pagination :page="curPage" :total="totalPages" :items-per-page="1" class="w-auto justify-end" @update:page="goToPage">
									<PaginationContent v-slot="{ items }" data-testid="recommendations-dialog-pagination-controls">
										<PaginationPrevious aria-label="Go to previous recommendations page" />
										<div class="flex flex-wrap items-center gap-2" data-testid="recommendations-dialog-pagination-pages">
											<template v-for="item in items" :key="item.type === 'page' ? `recommendation-page-${item.value}` : `recommendation-ellipsis-${item.key}`">
												<PaginationItem
													v-if="item.type === 'page'"
													:value="item.value"
													:is-active="item.value === curPage"
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
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import DOMPurify from 'dompurify';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@components/ui/pagination';
import type { RecommendationsResponse } from '@api/response/recommendations-response.ts';
import { useApiStore } from '@api/store.ts';
import RecommendationDialogSkeletonPartial from '@partials/RecDlgSkel.vue';
import { useDarkMode } from '@/dark-mode.ts';
import { image, date } from '@/public.ts';
import { siteContent } from '@support/content.ts';

type RenderMarkdownFn = typeof import('@support/markdown/render.ts').renderMarkdown;
type HighlightSupport = typeof import('@support/markdown/highlight.ts');
type HighlightCore = typeof import('highlight.js/lib/core').default;

const PAGE_SIZE = 8;

const api = useApiStore();
const { isDark } = useDarkMode();
const recsText = siteContent.recommendations;
const recs = ref<RecommendationsResponse[]>([]);
const recsWrap = ref<HTMLElement | null>(null);
const thmLink = ref<HTMLLinkElement | null>(null);
const mdRender = ref<RenderMarkdownFn | null>(null);
const curPage = ref(1);
const openRec = ref<string>('');
const isLoad = ref(false);
const isAnim = ref(false);
const hasLoad = ref(false);
const hasErr = ref(false);

let animTime: ReturnType<typeof setTimeout> | null = null;
let hlSup: HighlightSupport | null = null;
let hlCore: HighlightCore | null = null;

const readyRecs = computed(() =>
	recs.value.map((item) => ({
		...item,
		html: mdRender.value ? DOMPurify.sanitize(mdRender.value(item.text)) : '',
		formattedDate: date().format(new Date(item.created_at)),
	})),
);

const totalPages = computed(() => Math.max(1, Math.ceil(readyRecs.value.length / PAGE_SIZE)));

const pageRecs = computed(() => {
	const start = (curPage.value - 1) * PAGE_SIZE;
	return readyRecs.value.slice(start, start + PAGE_SIZE);
});

const isPrep = computed(() => !hasErr.value && (isAnim.value || isLoad.value || (hasLoad.value && !mdRender.value)));

const showPages = computed(() => !isAnim.value && !isLoad.value && !hasErr.value && readyRecs.value.length > PAGE_SIZE);

const clearThm = () => {
	if (thmLink.value) {
		thmLink.value.remove();
		thmLink.value = null;
	}
};

const loadMd = async () => {
	if (mdRender.value) {
		return;
	}

	try {
		const module = await import('@support/markdown/render.ts');

		mdRender.value = module.renderMarkdown;
	} catch {
		hasErr.value = true;
	}
};

const loadHl = async () => {
	if (hlSup && hlCore) {
		return { hlSup, hlCore };
	}

	try {
		const [supMod, coreMod] = await Promise.all([import('@support/markdown/highlight.ts'), import('highlight.js/lib/core')]);

		hlSup = supMod;
		hlCore = coreMod.default;

		await hlSup.initializeHighlighter(hlCore);

		return { hlSup, hlCore };
	} catch {
		return null;
	}
};

const loadRecs = async () => {
	if (isLoad.value || hasLoad.value) {
		return;
	}

	isLoad.value = true;
	hasErr.value = false;

	try {
		const response = await api.getRecommendations();

		recs.value = response.data ?? [];
		hasLoad.value = true;
	} catch {
		hasErr.value = true;
	} finally {
		isLoad.value = false;
	}
};

const resetDlg = () => {
	curPage.value = 1;
	openRec.value = '';
	hasErr.value = false;
};

const openDlg = () => {
	resetDlg();

	isAnim.value = true;

	if (animTime) {
		clearTimeout(animTime);
	}

	animTime = setTimeout(() => {
		isAnim.value = false;
	}, 150);

	void loadMd();
	void loadRecs();
};

const goToPage = (pageNum: number) => {
	curPage.value = Math.min(Math.max(1, pageNum), totalPages.value);

	openRec.value = '';
};

watch(totalPages, (pageCount) => {
	if (curPage.value > pageCount) {
		curPage.value = pageCount;
	}
});

onUnmounted(() => {
	clearThm();

	if (animTime) {
		clearTimeout(animTime);
	}
});

watch(
	[pageRecs, isDark, openRec],
	async ([nextRecs]) => {
		if (!nextRecs || nextRecs.length === 0 || isLoad.value || hasErr.value || !mdRender.value) {
			return;
		}

		await nextTick();

		const wrap = recsWrap.value;

		if (!wrap) {
			return;
		}

		const blocks = wrap.querySelectorAll('pre code');

		if (blocks.length === 0) {
			clearThm();

			return;
		}

		const result = await loadHl();

		if (!result) {
			return;
		}

		result.hlSup.loadHighlightTheme(isDark.value, thmLink);

		blocks.forEach((block) => {
			result.hlCore.highlightElement(block as HTMLElement);
		});
	},
	{ immediate: true },
);
</script>
