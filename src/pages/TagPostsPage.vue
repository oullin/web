<template>
	<div class="theme min-h-screen tags-page">
		<main class="page-shell" data-testid="tag-posts">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">TAGS // WRITING // EXPLORATION</p>
					<h1 id="tag-posts-top" class="page-title">Topics & Tags Explorer.</h1>
					<div class="page-copy">
						<p>Use tags to trace themes, tools, and recurring ideas across the writing. This view groups related material so one topic can be followed without jumping around blindly.</p>
					</div>
					<div class="page-pill-row">
						<button type="button" class="page-pill cursor-pointer border-0" @click="handleGoBack">Go back</button>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">Current Topic</div>
						<div class="page-panel-title">{{ formattedTagLabel || 'All tags' }}</div>
						<p class="page-panel-copy" data-testid="tag-posts-summary">
							<template v-if="summaryContent.label">
								{{ summaryContent.text }}
								<a href="#" class="font-semibold transition-colors hover:text-[var(--violet)]" @click.prevent="summaryContent.onLabelClick?.()">
									{{ summaryContent.label }}
								</a>
								<span v-if="summaryContent.suffix">{{ summaryContent.suffix }}</span>
							</template>
							<template v-else>
								{{ summaryContent.text }}
							</template>
						</p>
					</div>
					<div class="page-side-block">
						<div class="page-stat-value">{{ isLoading ? '…' : posts.length }}</div>
						<div class="page-stat-label">Articles matched</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<section>
					<span class="page-section-label">Articles</span>
					<h2 class="page-section-title">Browse the posts tied to this signal.</h2>
					<div class="relative min-h-[20rem] mt-8">
						<div v-if="isLoading" key="skeleton" class="space-y-5" data-testid="tag-posts-skeleton">
							<p role="status" class="sr-only">Loading articles…</p>
							<ArticleItemSkeletonPartial v-for="skeleton in skeletonCount" :key="`tag-post-skeleton-${skeleton}`" />
						</div>
						<p v-else-if="hasError" key="error" role="status" class="page-empty-state" data-testid="tag-posts-error">Something went wrong loading posts. Please try again later.</p>
						<div v-else-if="posts.length > 0" key="list" class="space-y-5" data-testid="tag-posts-list">
							<ArticleItemPartial v-for="post in posts" :key="post.uuid" :item="post" />
						</div>
						<p v-else-if="normalizedTag" key="empty" class="page-empty-state" data-testid="tag-posts-empty">No posts found for this tag.</p>
						<p v-else key="landing" class="page-empty-state" data-testid="tag-posts-landing">Select a tag to browse related articles.</p>
					</div>
				</section>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import FooterPartial from '@partials/FooterPartial.vue';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import ArticleItemSkeletonPartial from '@partials/ArticleItemSkeletonPartial.vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { PostResponse, PostsCollectionResponse } from '@api/response/index.ts';
import { SITE_NAME, buildKeywords, siteUrlFor, useSeo } from '@support/seo';
import { formatLabel, normalizeParam, sanitizeTag, summaryFor } from '@support/tags.ts';
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

const normalizedTag = computed(() => normalizeParam(route.params.tag));
const formattedTagLabel = computed(() => formatLabel(normalizedTag.value));

const handleGoBack = () => {
	apiStore.setSearchTerm('');
	goBack(router);
};

const onSummaryLabelClick = () => {
	const searchTerm = normalizedTag.value;
	apiStore.setSearchTerm(searchTerm);
};

const summaryContent = computed(() =>
	summaryFor(
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
	const tag = sanitizeTag(normalizedTag.value);

	if (!tag) {
		return {
			title: 'Topics and Tags',
			description: `Explore topics and tags across ${SITE_NAME}'s writing archive to follow themes, tools, and recurring ideas.`,
			keywords: buildKeywords('topics explorer', 'writing tags', 'article navigation', 'software architect/engineering', 'technical management', 'digital transformation', 'AI orchestration'),
			url: siteUrlFor('/tags'),
		};
	}

	const label = formattedTagLabel.value;

	return {
		title: `${label} Articles`,
		description: `Browse ${label} posts from ${SITE_NAME}'s writing archive, including essays and notes connected by the same theme.`,
		keywords: buildKeywords(tag, `${tag} topic`, `${tag} articles`, `${tag} essays`, 'software architect/engineering', 'technical management', 'digital transformation', 'AI orchestration'),
		url: siteUrlFor(`/tags/${encodeURIComponent(normalizedTag.value)}`),
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

// Watch for changes to tag
watch(
	normalizedTag,
	(newTag) => {
		if (apiStore.searchTerm !== newTag) {
			apiStore.setSearchTerm(newTag);
		}
		loadPostsForTag(newTag);
	},
	{ immediate: true },
);

// Watch for changes to search term from other sources (like the header)
watch(
	() => apiStore.searchTerm,
	(newSearchTerm) => {
		if (newSearchTerm !== normalizedTag.value) {
			loadPostsForTag(normalizedTag.value);
		}
	},
);

onBeforeRouteLeave(() => {
	apiStore.setSearchTerm('');
});
</script>
