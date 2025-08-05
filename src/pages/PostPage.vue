<template>
	<div v-if="post" class="max-w-7xl mx-auto">
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
									<router-link
										class="inline-flex text-sky-500 rounded-full border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30"
										to="/"
									>
										<span class="sr-only">Back</span>
										<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34">
											<path class="fill-current" d="m16.414 17 3.293 3.293-1.414 1.414L13.586 17l4.707-4.707 1.414 1.414z" />
										</svg>
									</router-link>
								</div>

								<article>
									<!-- Post header -->
									<header>
										<div class="flex items-center justify-between mb-1">
											<!-- Post date -->
											<div class="text-xs text-slate-500 uppercase">
												<span class="text-sky-500">—</span> {{ date().format(new Date(post.published_at)) }} <span class="text-slate-400 dark:text-slate-600">·</span>
												{{ getReadingTime(post.content) }}
											</div>
											<!-- Share buttons -->
											<ul class="inline-flex">
												<li>
													<a
														class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-500 transition duration-150 ease-in-out"
														:href="xURLFor(post)"
														aria-label="Twitter"
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
														class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-500 transition duration-150 ease-in-out"
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
														class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-500 transition duration-150 ease-in-out"
														href="#0"
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
										<h1 class="h1 font-aspekta mb-4">{{ post.title }}</h1>
									</header>
									<!-- Post content -->
									<div class="text-slate-500 dark:text-slate-400 space-y-8">
										<p>{{ post.excerpt }}</p>
										<img class="w-full" :src="post.cover_image_url" width="692" height="390" :alt="post.title" fetchpriority="high" aria-hidden="true" />
										<div ref="postContainer" class="space-y-4" v-html="htmlContent"></div>
									</div>
								</article>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetSponsorPartial />
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
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useRoute } from 'vue-router';
import { useApiStore } from '@api/store.ts';
import { useDarkMode } from '@/dark-mode.ts';
import highlight from 'highlight.js/lib/core';
import { debugError } from '@api/http-error.ts';
import FooterPartial from '@partials/FooterPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import type { PostResponse } from '@api/response/index.ts';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import { date, getReadingTime, initializeHighlighter } from '@/public.ts';
import { onMounted, ref, computed, watch, nextTick, watchEffect } from 'vue';

// --- Component
const route = useRoute();
const apiStore = useApiStore();
const { isDark } = useDarkMode();
const post = ref<PostResponse>();
const slug = ref<string>(route.params.slug as string);
const postContainer = ref<HTMLElement | null>(null);

marked.use({
	breaks: true,
	gfm: true,
});

const htmlContent = computed(() => {
	if (post.value && post.value.content) {
		return DOMPurify.sanitize(marked.parse(post.value.content) as string);
	}

	return '';
});

const xURLFor = (post: PostResponse) => {
	return `https://x.com/intent/tweet?url=${fullURLFor(post)}&text=${post.title}`;
};

const fullURLFor = (post: PostResponse) => {
	return `${window.location.origin}/posts/${post.slug}`;
};

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

watch(htmlContent, async () => {
	// Wait for Vue to update the DOM
	await nextTick();

	// Find all code blocks in the container and highlight them
	if (postContainer.value) {
		const blocks = postContainer.value.querySelectorAll('pre code');
		blocks.forEach((block) => {
			highlight.highlightElement(block as HTMLElement);
		});
	}
});

onMounted(async () => {
	await initializeHighlighter(highlight);

	try {
		post.value = (await apiStore.getPost(slug.value)) as PostResponse;
	} catch (error) {
		debugError(error);
	}
});
</script>
