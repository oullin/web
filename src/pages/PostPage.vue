<template>
	<div class="theme min-h-screen">
		<NavPartial />

		<main class="page-shell">
			<section class="page-band !pt-6">
				<div class="mb-6">
					<RouterLink
						v-lazy-link
						class="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--violet)] transition-all px-3 py-1.5 text-xs font-mono tracking-wider uppercase"
						to="/"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
							<path d="m16.414 17 3.293 3.293-1.414 1.414L13.586 17l4.707-4.707 1.414 1.414z" />
						</svg>
						Back
					</RouterLink>
				</div>

				<div class="relative min-h-[25rem]">
					<PostPageSkeletonPartial v-if="isLoading" key="skeleton" />

					<article v-else-if="post" key="post">
						<header class="page-hero border border-[var(--border)]">
							<div class="page-hero-main">
								<p class="page-kicker">POST // WRITING // SIGNAL</p>
								<div class="page-copy !mt-0 mb-4">
									<span class="text-[var(--violet)]">—</span> {{ date().format(new Date(post.published_at)) }}
									<span class="text-[var(--muted)]">·</span>
									{{ getReadingTime(post.content) }}
								</div>
								<h1 id="post-top" class="page-title !max-w-[12ch]">{{ post.title }}</h1>
								<p class="page-copy">{{ post.excerpt }}</p>

								<nav v-if="post.tags?.length" class="mt-6 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]" aria-label="Post tags" data-testid="post-tags">
									<ul class="flex flex-wrap items-center gap-y-1">
										<li v-for="(tag, index) in post.tags" :key="tag.uuid" class="flex items-center">
											<RouterLink :to="routeFor(tag.name)" data-testid="post-tag" class="transition-colors hover:text-[var(--violet)]">
												{{ formatLabel(tag.name) }}
											</RouterLink>
											<span v-if="index < post.tags.length - 1" class="mx-2 text-[var(--muted)]" aria-hidden="true" data-testid="post-tag-separator"> / </span>
										</li>
									</ul>
								</nav>
							</div>

							<div class="page-hero-side">
								<div class="page-side-block">
									<div class="page-section-label">Share</div>
									<ul class="inline-flex gap-2">
										<li>
											<a
												v-lazy-link
												class="flex justify-center items-center text-[var(--muted)] hover:text-[var(--violet)] transition duration-150 ease-in-out"
												:href="xURLFor(post)"
												aria-label="Twitter"
												target="_blank"
												rel="noopener noreferrer"
											>
												<svg class="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
													<path
														d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"
													></path>
												</svg>
											</a>
										</li>
										<li>
											<a
												v-lazy-link
												class="flex justify-center items-center text-[var(--muted)] hover:text-[var(--violet)] transition duration-150 ease-in-out"
												:href="`https://www.linkedin.com/sharing/share-offsite/?url=${fullURLFor(post)}`"
												aria-label="LinkedIn"
												target="_blank"
												rel="noopener noreferrer"
											>
												<svg class="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
													<path
														d="M24,24H20V18.33c0-1.41-.5-2.37-1.75-2.37a1.9,1.9,0,0,0-1.75,1.25c-.06.44-.08,1.06-.08,1.69V24H12V12h4v1.73a3.86,3.86,0,0,1,3.47-1.93c2.52,0,4.53,1.65,4.53,5.15V24ZM8,10a2,2,0,1,1,2-2A2,2,0,0,1,8,10ZM6,24H10V12H6Z"
													/>
												</svg>
											</a>
										</li>
										<li>
											<a
												v-lazy-link
												class="flex justify-center items-center text-[var(--muted)] hover:text-[var(--violet)] transition duration-150 ease-in-out"
												href="#"
												aria-label="Share"
												@click.prevent="sharePost(post)"
											>
												<svg class="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
													<path
														d="M20 14c1.654 0 3-1.346 3-3s-1.346-3-3-3-3 1.346-3 3c0 .223.029.439.075.649l-3.22 2.012A2.97 2.97 0 0 0 12 13c-1.654 0-3 1.346-3 3s1.346 3 3 3a2.97 2.97 0 0 0 1.855-.661l3.22 2.012c-.046.21-.075.426-.075.649 0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3a2.97 2.97 0 0 0-1.855.661l-3.22-2.012c.046-.21.075-.426.075-.649 0-.223-.029-.439-.075-.649l3.22-2.012A2.97 2.97 0 0 0 20 14Z"
													></path>
												</svg>
											</a>
										</li>
									</ul>
								</div>
								<div class="page-cover-frame">
									<CoverImageLoader class="w-full aspect-[4/3]" :src="post.cover_image_url || ''" :alt="post.title" :width="692" :height="390" />
								</div>
							</div>
						</header>

						<section class="page-article">
							<div ref="postContainer" class="post-markdown" v-html="htmlContent"></div>
						</section>

						<section class="page-support-grid !pt-0">
							<WidgetSocialTransitionWrapper />
							<WidgetSponsorPartial />
							<div class="page-summary-card">
								<div class="page-section-label">Reading Mode</div>
								<div class="page-panel-title">Slow down enough to notice the structure.</div>
								<p class="page-panel-copy">The point of this writing is not volume. It is signal that survives rereading.</p>
							</div>
						</section>
					</article>

					<p v-else key="error" class="page-empty-state">We couldn't load this post.</p>
				</div>

				<div class="flex justify-end pt-10">
					<BackToTopLink target="#post-top" />
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import { RouterLink, useRoute } from 'vue-router';
import { useApiStore } from '@api/store.ts';
import { useDarkMode } from '@/dark-mode.ts';
import highlight from 'highlight.js/lib/core';
import { debugError } from '@api/http-error.ts';
import { date, getReadingTime } from '@/public.ts';
import NavPartial from '@partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import PostPageSkeletonPartial from '@partials/PostPageSkeletonPartial.vue';
import type { PostResponse } from '@api/response/index.ts';
import { siteUrlFor, useSeoFromPost } from '@/support/seo';
import { formatLabel, routeFor } from '@/support/tags.ts';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import WidgetSocialTransitionWrapper from '@components/WidgetSocialTransitionWrapper.vue';
import BackToTopLink from '@partials/BackToTopLink.vue';
import { onMounted, onUnmounted, ref, computed, watch, nextTick, watchEffect } from 'vue';
import { initializeHighlighter, loadHighlightTheme, renderMarkdown } from '@/support/markdown.ts';
import CoverImageLoader from '@components/CoverImageLoader.vue';

// --- Component
const route = useRoute();
const apiStore = useApiStore();
const { isDark } = useDarkMode();
const post = ref<PostResponse>();
const isLoading = ref(true);
const postContainer = ref<HTMLElement | null>(null);
const slug = ref<string>(route.params.slug as string);
const themeLink = ref<HTMLLinkElement | null>(null);

useSeoFromPost(post);

const htmlContent = computed(() => {
	if (post.value && post.value.content) {
		return DOMPurify.sanitize(renderMarkdown(post.value.content));
	}

	return '';
});

const xURLFor = (item: PostResponse) => {
	return `https://x.com/intent/tweet?url=${fullURLFor(item)}&text=${item.title}`;
};

const fullURLFor = (item: PostResponse) => siteUrlFor(`/post/${item.slug}`);

async function sharePost(item: PostResponse) {
	const shareData = {
		title: item.title,
		text: item.excerpt,
		url: fullURLFor(item),
	};
	try {
		await navigator.share(shareData);
	} catch (err) {
		console.error("Couldn't share the post:", err);
	}
}

watchEffect(() => {
	loadHighlightTheme(isDark.value, themeLink);
});

onUnmounted(() => {
	if (themeLink.value) {
		themeLink.value.remove();
		themeLink.value = null;
	}
});

watch(htmlContent, async (newContent) => {
	if (!newContent) {
		return;
	}

	await nextTick();
	await initializeHighlighter(highlight);

	const container = postContainer.value;
	if (!container) {
		return;
	}

	const blocks = container.querySelectorAll('pre code');
	blocks.forEach((block) => {
		highlight.highlightElement(block as HTMLElement);
	});

	const images = container.querySelectorAll('img');
	images.forEach((image) => {
		image.setAttribute('loading', 'lazy');
		image.setAttribute('decoding', 'async');
		if (!image.getAttribute('fetchpriority')) {
			image.setAttribute('fetchpriority', 'low');
		}
	});
});

onMounted(async () => {
	await initializeHighlighter(highlight);

	try {
		post.value = (await apiStore.getPost(slug.value)) as PostResponse;
	} catch (error) {
		debugError(error);
	} finally {
		isLoading.value = false;
	}
});
</script>
