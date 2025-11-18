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
								<!-- Back -->
								<div class="mb-3">
									<RouterLink
										v-lazy-link
										class="inline-flex text-fuchsia-500 dark:text-slate-500 dark:hover:text-teal-600 rounded-full border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30"
										to="/"
									>
										<span class="sr-only">Back</span>
										<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34">
											<path class="fill-current" d="m16.414 17 3.293 3.293-1.414 1.414L13.586 17l4.707-4.707 1.414 1.414z" />
										</svg>
									</RouterLink>
								</div>

								<div class="relative min-h-[25rem]">
									<PostPageSkeletonPartial v-if="isLoading" key="skeleton" />

									<article v-else-if="post" key="post">
										<!-- Post header -->
										<header>
											<div class="flex items-center justify-between mb-1">
												<!-- Post date -->
												<div class="text-xs text-slate-500 uppercase">
													<span class="text-fuchsia-500 dark:text-teal-600">—</span> {{ date().format(new Date(post.published_at)) }}
													<span class="text-slate-400 dark:text-slate-600">·</span>
													{{ getReadingTime(post.content) }}
												</div>
												<!-- Share buttons -->
												<ul class="inline-flex">
													<li>
														<a
															v-lazy-link
															class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-teal-600 transition duration-150 ease-in-out"
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
															class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-teal-600 transition duration-150 ease-in-out"
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
															class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-fuchsia-500 dark:hover:text-teal-600 transition duration-150 ease-in-out"
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

											<h1 id="post-top" class="h1 font-aspekta mb-4">{{ post.title }}</h1>

											<nav
												v-if="post.tags?.length"
												class="mt-6 mb-6 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
												aria-label="Post tags"
												data-testid="post-tags"
											>
												<ul class="flex flex-wrap items-center gap-y-1">
													<li v-for="(tag, index) in post.tags" :key="tag.uuid" class="flex items-center">
														<RouterLink :to="Tags.routeFor(tag.name)" data-testid="post-tag" class="transition-colors hover:text-fuchsia-500 dark:hover:text-teal-500">
															{{ Tags.formatLabel(tag.name) }}
														</RouterLink>
														<span v-if="index < post.tags.length - 1" class="mx-2 text-slate-400 dark:text-slate-600" aria-hidden="true" data-testid="post-tag-separator">
															/
														</span>
													</li>
												</ul>
											</nav>
										</header>

										<!-- Post content -->
										<div class="text-slate-500 dark:text-slate-400 space-y-8">
											<p>{{ post.excerpt }}</p>
											<CoverImageLoader class="w-full aspect-[16/9]" :src="post.cover_image_url || ''" :alt="post.title" :width="692" :height="390" />
											<div ref="postContainer" class="post-markdown" v-html="htmlContent"></div>
										</div>
									</article>

									<p v-else key="error" class="text-slate-500 dark:text-slate-400">We couldn't load this post.</p>
								</div>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetSocialTransitionWrapper />
								<WidgetSponsorPartial />
							</div>
						</aside>
					</div>

					<div class="flex justify-end pt-10 mb-10">
						<BackToTopLink target="#post-top" />
					</div>

					<FooterPartial />
				</div>
			</main>
		</div>
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
import FooterPartial from '@partials/FooterPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import PostPageSkeletonPartial from '@partials/PostPageSkeletonPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import type { PostResponse } from '@api/response/index.ts';
import { siteUrlFor, useSeoFromPost } from '@/support/seo';
import { Tags } from '@/support/tags.ts';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import WidgetSocialTransitionWrapper from '@components/WidgetSocialTransitionWrapper.vue';
import BackToTopLink from '@partials/BackToTopLink.vue';
import { onMounted, ref, computed, watch, nextTick, watchEffect } from 'vue';
import { initializeHighlighter, renderMarkdown } from '@/support/markdown.ts';
import CoverImageLoader from '@components/CoverImageLoader.vue';

// --- Component
const route = useRoute();
const apiStore = useApiStore();
const { isDark } = useDarkMode();
const post = ref<PostResponse>();
const isLoading = ref(true);
const postContainer = ref<HTMLElement | null>(null);
const slug = ref<string>(route.params.slug as string);

useSeoFromPost(post);

const htmlContent = computed(() => {
	if (post.value && post.value.content) {
		return DOMPurify.sanitize(renderMarkdown(post.value.content));
	}

	return '';
});

const xURLFor = (post: PostResponse) => {
	return `https://x.com/intent/tweet?url=${fullURLFor(post)}&text=${post.title}`;
};

const fullURLFor = (post: PostResponse) => siteUrlFor(`/post/${post.slug}`);

async function sharePost(post: PostResponse) {
	const shareData = {
		title: post.title,
		text: post.excerpt,
		url: fullURLFor(post),
	};
	try {
		await navigator.share(shareData);
	} catch (err) {
		console.error("Couldn't share the post:", err);
	}
}

watchEffect(() => {
	if (isDark.value) {
		import('highlight.js/styles/github-dark.css');
	} else {
		import('highlight.js/styles/github.css');
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
