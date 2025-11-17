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
							<div class="max-w-[700px]" data-testid="tag-posts">
								<section>
									<!-- Page title -->
									<div class="flex flex-wrap items-center justify-between gap-4 mb-12">
										<h1 id="tag-posts-top" class="h1 font-aspekta">Topics & Tags Explorer</h1>
										<button
											type="button"
											class="inline-flex items-center gap-2 text-sm font-medium transition-colors rounded-full border border-slate-200/70 px-4 py-2 text-slate-600 hover:border-fuchsia-400/70 hover:text-slate-800 dark:border-slate-700/80 dark:text-slate-300 dark:hover:text-slate-100 cursor-pointer"
											@click="handleGoBack"
										>
											<span aria-hidden="true">←</span>
											Go back
										</button>
									</div>

									<!-- Page content -->
									<div class="space-y-10">
										<div class="mb-5">
											<p>
												Post tags help you quickly find the themes, tools or ideas you care about most across the blog. Browse through the tags below to group related posts
												together and dive deeper into specific topics, from high-level concepts to hands-on guides.
											</p>
											<p class="mt-4" data-testid="tag-posts-summary">
												<template v-if="summaryContent.label">
													{{ summaryContent.text }}
													<a
														href="#"
														class="font-semibold transition-colors hover:text-fuchsia-500 dark:hover:text-teal-500"
														@click.prevent="summaryContent.onLabelClick?.()"
													>
														{{ summaryContent.label }}
													</a>
													<span v-if="summaryContent.suffix">{{ summaryContent.suffix }}</span>
												</template>
												<template v-else>
													{{ summaryContent.text }}
												</template>
											</p>
										</div>
										<section role="status">
											<h2 class="font-aspekta text-xl font-[650] mb-6">Articles</h2>
											<div class="relative min-h-[20rem]">
												<div v-if="isLoading" key="skeleton" class="space-y-5" data-testid="tag-posts-skeleton">
													<ArticleItemSkeletonPartial v-for="skeleton in skeletonCount" :key="`tag-post-skeleton-${skeleton}`" />
												</div>
												<div key="list" class="space-y-5" data-testid="tag-posts-list">
													<ArticleItemPartial v-for="post in posts" :key="post.uuid" :item="post" />
												</div>
											</div>
										</section>
									</div>
								</section>
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
						<BackToTopLink target="#tag-posts-top" />
					</div>

					<FooterPartial />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import HeaderPartial from '@partials/HeaderPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import ArticleItemSkeletonPartial from '@partials/ArticleItemSkeletonPartial.vue';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import WidgetSocialTransitionWrapper from '@components/WidgetSocialTransitionWrapper.vue';
import BackToTopLink from '@partials/BackToTopLink.vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { PostResponse, PostsCollectionResponse } from '@api/response/index.ts';
import { SITE_NAME, buildKeywords, siteUrlFor, useSeo } from '@/support/seo';
import { Tags } from '@/support/tags.ts';
import { goBack } from '@/public.ts';

const DEFAULT_SKELETON_COUNT = 3;
const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();

const posts = ref<PostResponse[]>([]);
const skeletonCount = ref(DEFAULT_SKELETON_COUNT);
const isLoading = ref(false);
const hasError = ref(false);
let lastRequestId = 0;

const normalizedTag = computed(() => Tags.normalizeParam(route.params.tag));

const formattedTagLabel = computed(() => Tags.formatLabel(normalizedTag.value));

const handleGoBack = () => {
	// If search is active, clear it and stay on the page
	if (apiStore.searchTerm.trim()) {
		apiStore.setSearchTerm('');
		const searchElement = document.getElementById('search') as HTMLInputElement | null;
		if (searchElement) {
			searchElement.value = '';
			searchElement.dispatchEvent(new Event('input', { bubbles: true }));
		}
	} else {
		// No search active, go back to previous page
		goBack(router);
	}
};

const onSummaryLabelClick = (label: string) => {
	const searchTerm = label.replace(/^#/, '').toLowerCase();
	apiStore.setSearchTerm(searchTerm);

	const searchElement = document.getElementById('search') as HTMLInputElement | null;
	if (searchElement) {
		searchElement.value = searchTerm;
		searchElement.dispatchEvent(new Event('input', { bubbles: true }));
	}
};

const summaryContent = computed(() =>
	Tags.summaryFor(
		normalizedTag.value,
		{
			isLoading: isLoading.value,
			hasError: hasError.value,
			postCount: posts.value.length,
		},
		onSummaryLabelClick,
	),
);

const seoOptions = computed(() => {
	const tag = normalizedTag.value;

	if (!tag) {
		return {
			title: 'Tagged posts',
			description: `Explore tagged articles on ${SITE_NAME}.`,
			url: siteUrlFor('/tags'),
		};
	}

	const encodedTag = encodeURIComponent(tag);
	const label = formattedTagLabel.value;

	return {
		title: `Posts tagged ${label}`,
		description: `Explore articles tagged ${label} on ${SITE_NAME}.`,
		keywords: buildKeywords(tag, `${tag} posts`, `${tag} articles`),
		url: siteUrlFor(`/tags/${encodedTag}`),
	};
});

useSeo(seoOptions);

const loadPostsForTag = async (tagName: string) => {
	const requestId = ++lastRequestId;
	hasError.value = false;

	if (!tagName) {
		posts.value = [];
		skeletonCount.value = DEFAULT_SKELETON_COUNT;
		isLoading.value = false;
		return;
	}

	const previousPosts = posts.value;
	skeletonCount.value = previousPosts.length > 0 ? previousPosts.length : DEFAULT_SKELETON_COUNT;
	isLoading.value = true;

	try {
		const collection: PostsCollectionResponse = await apiStore.getPosts({
			tag: tagName,
			text: apiStore.searchTerm.trim(),
		});

		if (requestId !== lastRequestId) {
			return;
		}

		posts.value = (collection.data ?? []) as PostResponse[];
	} catch (error) {
		debugError(error);

		if (requestId !== lastRequestId) {
			return;
		}

		hasError.value = true;
		posts.value = [];
	} finally {
		if (requestId === lastRequestId) {
			skeletonCount.value = posts.value.length > 0 ? posts.value.length : DEFAULT_SKELETON_COUNT;
			isLoading.value = false;
		}
	}
};

const isInitializing = ref(true);

watch(
	() => apiStore.searchTerm,
	() => {
		// Don't trigger during initialization to avoid race conditions
		if (!isInitializing.value) {
			loadPostsForTag(normalizedTag.value);
		}
	},
);

onMounted(() => {
	// Clear any existing search term when mounting the page with a specific tag
	// unless we're coming from a search (in which case the search term matches the tag)
	const currentSearchTerm = apiStore.searchTerm.trim().toLowerCase();
	const currentTag = normalizedTag.value.toLowerCase();

	if (currentSearchTerm && currentSearchTerm !== currentTag) {
		apiStore.setSearchTerm('');
		const searchElement = document.getElementById('search') as HTMLInputElement | null;

		if (searchElement) {
			searchElement.value = '';
		}
	}

	loadPostsForTag(normalizedTag.value);
	isInitializing.value = false;
});

onBeforeRouteUpdate((to, from, next) => {
	const newTag = Tags.normalizeParam(to.params.tag);
	const oldTag = Tags.normalizeParam(from.params.tag);

	// Clear search term when navigating to a different tag
	if (newTag !== oldTag) {
		isInitializing.value = true; // Prevent watcher from triggering during route update
		apiStore.setSearchTerm('');
		const searchElement = document.getElementById('search') as HTMLInputElement | null;

		if (searchElement) {
			searchElement.value = '';
		}
	}

	loadPostsForTag(newTag);
	isInitializing.value = false;

	next();
});
</script>
