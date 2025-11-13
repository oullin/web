<template>
	<div class="max-w-7xl mx-auto">
		<div class="min-h-screen flex">
			<SideNavPartial />

			<main class="grow overflow-hidden px-6">
				<div id="tag-posts-top" class="w-full h-full max-w-[1072px] mx-auto flex flex-col">
					<HeaderPartial />

					<div class="grow md:flex space-y-8 md:space-y-0 md:space-x-8 pt-12 md:pt-16 pb-16 md:pb-20">
						<div class="grow">
							<div class="max-w-[700px]" data-testid="tag-posts">
								<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-8">
									<div>
										<p class="text-xs uppercase text-slate-500">
											<span class="text-fuchsia-500 dark:text-teal-600">—</span>
											Tag
										</p>
										<h1 class="font-aspekta text-2xl md:text-3xl font-[650] text-slate-700 dark:text-slate-200 mt-1">
											Posts tagged <span class="text-fuchsia-500 dark:text-teal-500">{{ formattedTagLabel }}</span>
										</h1>
										<p class="text-sm text-slate-500 dark:text-slate-400 mt-2" data-testid="tag-posts-summary">
											{{ summaryMessage }}
										</p>
									</div>
									<RouterLink
										v-lazy-link
										class="inline-flex items-center text-sm font-medium text-slate-500 hover:text-fuchsia-500 dark:hover:text-teal-500 transition duration-150 ease-in-out"
										to="/"
									>
										← Back to home
									</RouterLink>
								</div>

								<div role="status">
									<div v-if="isLoading" class="space-y-5" data-testid="tag-posts-skeleton">
										<ArticleItemSkeletonPartial v-for="skeleton in skeletonCount" :key="`tag-post-skeleton-${skeleton}`" />
									</div>
									<div v-else-if="hasError" class="py-8 text-slate-500 dark:text-slate-400" data-testid="tag-posts-error">
										{{ summaryMessage }}
									</div>
									<div v-else-if="posts.length === 0" class="py-8 text-slate-500 dark:text-slate-400" data-testid="tag-posts-empty">
										{{ summaryMessage }}
									</div>
									<div v-else class="space-y-5" data-testid="tag-posts-list">
										<ArticleItemPartial v-for="post in posts" :key="post.uuid" :item="post" />
									</div>
								</div>
							</div>
						</div>

						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetSocialPartial />
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
import { computed, ref, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import HeaderPartial from '@partials/HeaderPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import ArticleItemSkeletonPartial from '@partials/ArticleItemSkeletonPartial.vue';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import BackToTopLink from '@partials/BackToTopLink.vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { PostResponse, PostsCollectionResponse } from '@api/response/index.ts';
import { SITE_NAME, buildKeywords, siteUrlFor, useSeo } from '@/support/seo';
import { Tags } from '@/support/tags.ts';

const DEFAULT_SKELETON_COUNT = 3;
const apiStore = useApiStore();
const route = useRoute();

const posts = ref<PostResponse[]>([]);
const skeletonCount = ref(DEFAULT_SKELETON_COUNT);
const isLoading = ref(false);
const hasError = ref(false);
let lastRequestId = 0;

const normalizedTag = computed(() => Tags.normalizeParam(route.params.tag));

const formattedTagLabel = computed(() => Tags.formatLabel(normalizedTag.value));

const summaryMessage = computed(() =>
	Tags.summaryFor(normalizedTag.value, {
		isLoading: isLoading.value,
		hasError: hasError.value,
		postCount: posts.value.length,
	}),
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

const fetchPosts = async (tagName: string) => {
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
		const collection: PostsCollectionResponse = await apiStore.getPosts({ tag: tagName });

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

watch(
	normalizedTag,
	(newTag) => {
		fetchPosts(newTag);
	},
	{ immediate: true },
);
</script>
