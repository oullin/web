<template>
	<div class="theme min-h-screen tags-page">
		<main class="page-shell" data-testid="tag-posts">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">WRITING // TOPICS // FIND YOUR PROBLEM</p>
					<h1 id="tag-posts-top" class="page-title">Find what's relevant to your system.</h1>
					<div class="page-copy">
						<p>Tags trace recurring problems, patterns, and decisions across the writing. Pick a topic and follow it through — without jumping around blindly.</p>
					</div>
					<div class="page-pill-row">
						<button type="button" class="page-pill cursor-pointer border-0" @click="goBackFn">Go back</button>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">Current Topic</div>
						<div class="page-panel-title">{{ tagLabel || 'All tags' }}</div>
						<p class="page-panel-copy" data-testid="tag-posts-summary">
							<template v-if="sumText.label">
								{{ sumText.text }}
								<a href="#" class="font-semibold transition-colors hover:text-(--violet)" @click.prevent="sumText.onLabelClick?.()">
									{{ sumText.label }}
								</a>
								<span v-if="sumText.suffix">{{ sumText.suffix }}</span>
							</template>
							<template v-else>
								{{ sumText.text }}
							</template>
						</p>
					</div>
					<div class="page-side-block">
						<div class="page-stat-value">{{ isLoad ? '…' : posts.length }}</div>
						<div class="page-stat-label">Articles matched</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<section>
					<span class="page-section-label">Articles</span>
					<h2 class="page-section-title">Browse the posts tied to this signal.</h2>
					<div class="relative min-h-80 mt-8">
						<div v-if="isLoad" key="skeleton" class="space-y-5" data-testid="tag-posts-skeleton">
							<p role="status" class="sr-only">Loading articles…</p>
							<ArticleItemSkeletonPartial v-for="skeleton in skelCnt" :key="`tag-post-skeleton-${skeleton}`" />
						</div>
						<p v-else-if="hasError" key="error" role="status" class="page-empty-state" data-testid="tag-posts-error">Something went wrong loading posts. Please try again later.</p>
						<div v-else-if="posts.length > 0" key="list" class="space-y-5" data-testid="tag-posts-list">
							<ArticleItemPartial v-for="post in posts" :key="post.uuid" :item="post" />
						</div>
						<p v-else-if="cleanName" key="empty" class="page-empty-state" data-testid="tag-posts-empty">No posts found for this tag.</p>
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
import FooterPartial from '@partials/Footer.vue';
import ArticleItemPartial from '@partials/ArtItem.vue';
import ArticleItemSkeletonPartial from '@partials/ArtItemSk.vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { PostResponse, PostsCollectionResponse } from '@api/response/index.ts';
import { SITE_NAME, buildKeywords, siteUrlFor, useSeo } from '@support/seo';
import { fmtLabel, normTag, cleanTag, tagSum } from '@support/tags.ts';
import { goBack } from '@/public.ts';

const DEFAULT_SKELETON_COUNT = 3;
const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();

const posts = ref<PostResponse[]>([]);
const skelCnt = ref(DEFAULT_SKELETON_COUNT);
const isLoad = ref(false);
const hasError = ref(false);
let lastReq = 0;

const cleanName = computed(() => normTag(route.params.tag));
const tagLabel = computed(() => fmtLabel(cleanName.value));

const goBackFn = () => {
	apiStore.setSearchTerm('');
	goBack(router);
};

const onTagClk = () => {
	const srchTerm = cleanName.value;
	apiStore.setSearchTerm(srchTerm);
};

const sumText = computed(() =>
	tagSum(
		cleanName.value,
		{
			isLoading: isLoad.value,
			hasError: hasError.value,
			postCount: posts.value.length,
		},
		onTagClk,
	),
);

const seoOptions = computed(() => {
	const tag = cleanTag(cleanName.value);

	if (!tag) {
		return {
			title: 'Topics and Tags',
			description: `Explore topics and tags across ${SITE_NAME}'s writing archive to follow themes, tools, and recurring ideas.`,
			keywords: buildKeywords('topics explorer', 'writing tags', 'article navigation', 'software architect/engineering', 'technical management', 'digital transformation', 'AI orchestration'),
			url: siteUrlFor('/tags'),
		};
	}

	const label = tagLabel.value;

	return {
		title: `${label} Articles`,
		description: `Browse ${label} posts from ${SITE_NAME}'s writing archive, including essays and notes connected by the same theme.`,
		keywords: buildKeywords(tag, `${tag} topic`, `${tag} articles`, `${tag} essays`, 'software architect/engineering', 'technical management', 'digital transformation', 'AI orchestration'),
		url: siteUrlFor(`/tags/${encodeURIComponent(cleanName.value)}`),
	};
});

useSeo(seoOptions);

const loadPosts = async (tagName: string) => {
	const reqId = ++lastReq;
	hasError.value = false;

	if (!tagName) {
		posts.value = [];
		skelCnt.value = DEFAULT_SKELETON_COUNT;
		isLoad.value = false;
		return;
	}

	const prevPosts = posts.value;
	skelCnt.value = prevPosts.length > 0 ? prevPosts.length : DEFAULT_SKELETON_COUNT;
	isLoad.value = true;

	try {
		const collection: PostsCollectionResponse = await apiStore.getPosts({
			tag: tagName,
			text: apiStore.searchTerm.trim(),
		});

		if (reqId !== lastReq) {
			return;
		}

		posts.value = (collection.data ?? []) as PostResponse[];
	} catch (error) {
		debugError(error);

		if (reqId !== lastReq) {
			return;
		}

		hasError.value = true;
		posts.value = [];
	} finally {
		if (reqId === lastReq) {
			skelCnt.value = posts.value.length > 0 ? posts.value.length : DEFAULT_SKELETON_COUNT;
			isLoad.value = false;
		}
	}
};

// Watch for changes to tag
watch(
	cleanName,
	(newTag) => {
		if (apiStore.searchTerm !== newTag) {
			apiStore.setSearchTerm(newTag);
		}
		loadPosts(newTag);
	},
	{ immediate: true },
);

// Watch for changes to search term from other sources (like the header)
watch(
	() => apiStore.searchTerm,
	(newSearchTerm) => {
		if (newSearchTerm !== cleanName.value) {
			loadPosts(cleanName.value);
		}
	},
);

onBeforeRouteLeave(() => {
	apiStore.setSearchTerm('');
});
</script>
