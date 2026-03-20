<template>
	<div class="theme min-h-screen post-page">
		<main class="page-shell">
			<section class="page-band pt-6!">
				<div class="mb-6">
					<button
						type="button"
						class="inline-flex items-center gap-2 border border-(--border) px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-(--muted) transition-all hover:border-(--violet) hover:text-(--text) cursor-pointer"
						@click="handleGoBack"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
							<path d="m16.414 17 3.293 3.293-1.414 1.414L13.586 17l4.707-4.707 1.414 1.414z" />
						</svg>
						Back
					</button>
				</div>

				<div class="relative min-h-100">
					<PostPageSkeletonPartial v-if="isLoading" key="skeleton" />

					<article v-else-if="post" key="post">
						<header class="page-hero page-hero--single border border-(--border)">
							<div class="page-hero-main">
								<div class="post-hero-layout" :class="{ 'post-hero-layout--with-cover': Boolean(post.cover_image_url) }">
									<div class="post-hero-copy">
										<p class="page-kicker">POST // WRITING // SIGNAL</p>
										<div class="page-copy mt-0! mb-4">
											<span class="text-(--violet)">—</span> {{ date().format(new Date(post.published_at)) }}
											<span class="text-(--muted)">·</span>
											{{ getReadingTime(post.content) }}
										</div>
										<h1 id="post-top" class="page-title max-w-[12ch]!">{{ post.title }}</h1>
										<p class="page-copy">{{ post.excerpt }}</p>
										<p class="page-copy">&nbsp;</p>

										<nav v-if="post.tags?.length" class="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-(--muted)" aria-label="Post tags" data-testid="post-tags">
											<ul class="flex flex-wrap items-center gap-y-1">
												<li v-for="(tag, index) in post.tags" :key="tag.uuid" class="flex items-center">
													<RouterLink :to="routeFor(tag.name)" data-testid="post-tag" class="transition-colors hover:text-(--violet)">
														{{ formatLabel(tag.name) }}
													</RouterLink>
													<span v-if="index < post.tags.length - 1" class="mx-2 text-(--muted)" aria-hidden="true" data-testid="post-tag-separator"> / </span>
												</li>
											</ul>
										</nav>
									</div>

									<div v-if="post.cover_image_url" class="post-hero-media" data-testid="post-cover">
										<CoverImageLoader class="post-hero-cover" :src="post.cover_image_url" :alt="post.title" :width="420" :height="520" loading="eager" fetchpriority="high" />
									</div>
								</div>
							</div>
						</header>

						<section class="page-article">
							<div ref="postContainer" class="post-markdown prose dark:prose-invert" v-html="htmlContent"></div>
						</section>
					</article>

					<p v-else key="error" class="page-empty-state">We couldn't load this post.</p>
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useApiStore } from '@api/store.ts';
import { useDarkMode } from '@/dark-mode.ts';
import { debugError } from '@api/http-error.ts';
import { date, getReadingTime, goBack } from '@/public.ts';
import FooterPartial from '@partials/FooterPartial.vue';
import PostPageSkeletonPartial from '@partials/PostPageSkeletonPartial.vue';
import type { PostResponse } from '@api/response/index.ts';
import { useSeoFromPost } from '@support/seo';
import { formatLabel, routeFor } from '@support/tags.ts';
import CoverImageLoader from '@components/CoverImageLoader.vue';
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue';
import { renderMarkdown } from '@support/markdown/render.ts';

type HighlightSupport = typeof import('@support/markdown/highlight.ts');
type HighlightCore = typeof import('highlight.js/lib/core').default;

// --- Component
const route = useRoute();
const router = useRouter();
const handleGoBack = () => goBack(router);
const apiStore = useApiStore();
const { isDark } = useDarkMode();
const post = ref<PostResponse>();
const isLoading = ref(true);
const postContainer = ref<HTMLElement | null>(null);
const slug = ref<string>(route.params.slug as string);
const themeLink = ref<HTMLLinkElement | null>(null);
let highlightSupport: HighlightSupport | null = null;
let highlightCore: HighlightCore | null = null;

useSeoFromPost(post);

const htmlContent = computed(() => {
	if (post.value && post.value.content) {
		return DOMPurify.sanitize(renderMarkdown(post.value.content));
	}

	return '';
});

const clearHighlightTheme = () => {
	if (themeLink.value) {
		themeLink.value.remove();
		themeLink.value = null;
	}
};

const ensureHighlighterReady = async () => {
	if (highlightSupport && highlightCore) {
		return { highlightSupport, highlightCore };
	}

	const [highlightSupportModule, highlightCoreModule] = await Promise.all([import('@support/markdown/highlight.ts'), import('highlight.js/lib/core')]);

	highlightSupport = highlightSupportModule;
	highlightCore = highlightCoreModule.default;

	await highlightSupport.initializeHighlighter(highlightCore);

	return { highlightSupport, highlightCore };
};

onUnmounted(() => {
	clearHighlightTheme();
});

watch([htmlContent, isDark], async ([newContent]) => {
	if (!newContent) {
		clearHighlightTheme();

		return;
	}

	await nextTick();

	const container = postContainer.value;

	if (!container) {
		return;
	}

	const images = container.querySelectorAll('img');
	images.forEach((image) => {
		image.setAttribute('loading', 'lazy');
		image.setAttribute('decoding', 'async');
		if (!image.getAttribute('fetchpriority')) {
			image.setAttribute('fetchpriority', 'low');
		}
	});

	const blocks = container.querySelectorAll('pre code');
	if (blocks.length === 0) {
		clearHighlightTheme();

		return;
	}

	const { highlightSupport, highlightCore } = await ensureHighlighterReady();

	highlightSupport.loadHighlightTheme(isDark.value, themeLink);

	blocks.forEach((block) => {
		highlightCore.highlightElement(block as HTMLElement);
	});
});

onMounted(async () => {
	try {
		post.value = (await apiStore.getPost(slug.value)) as PostResponse;
	} catch (error) {
		debugError(error);
	} finally {
		isLoading.value = false;
	}
});
</script>
