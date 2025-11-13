<template>
	<div class="max-w-7xl mx-auto">
		<div class="min-h-screen flex">
			<SideNavPartial />

			<main class="grow overflow-hidden px-6">
				<div id="tag-top" class="w-full h-full max-w-[1072px] mx-auto flex flex-col">
					<HeaderPartial />

					<div class="grow md:flex space-y-8 md:space-y-0 md:space-x-8 pt-12 md:pt-16 pb-16 md:pb-20">
						<div class="grow">
							<div class="max-w-[700px] space-y-8">
								<div class="mb-3">
									<router-link v-lazy-link class="inline-flex text-fuchsia-500 dark:text-slate-500 dark:hover:text-teal-600" to="/">
										<span class="sr-only">Back</span>
										<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34">
											<path class="fill-current" d="m16.414 17 3.293 3.293-1.414 1.414L13.586 17l4.707-4.707 1.414 1.414z" />
										</svg>
									</router-link>
								</div>

								<header class="space-y-3">
									<h1 class="h2 font-aspekta">Posts tagged {{ formattedTagLabel }}</h1>
									<p class="text-sm text-slate-500 dark:text-slate-400 max-w-prose">Browse all stories that explore this topic.</p>
								</header>

								<section aria-live="polite" class="space-y-8">
									<div v-if="isLoading" aria-busy="true">
										<ArticleItemSkeletonPartial v-for="skeleton in SKELETON_COUNT" :key="`tag-skeleton-${skeleton}`" />
									</div>
									<div v-else-if="posts.length > 0" class="space-y-8">
										<ArticleItemPartial v-for="item in posts" :key="item.uuid" :item="item" />
									</div>
									<p v-else class="text-slate-500 dark:text-slate-400">No posts found for this tag.</p>
								</section>
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
						<BackToTopLink target="#tag-top" />
					</div>

					<FooterPartial />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { PostResponse, PostsCollectionResponse } from '@api/response/index.ts';
import SideNavPartial from '@partials/SideNavPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import ArticleItemSkeletonPartial from '@partials/ArticleItemSkeletonPartial.vue';
import BackToTopLink from '@partials/BackToTopLink.vue';

const apiStore = useApiStore();
const route = useRoute();

const posts = ref<PostResponse[]>([]);
const isLoading = ref(true);
const SKELETON_COUNT = 3;

const formatTagLabel = (tagName: string) => `#${tagName.toUpperCase()}`;

const decodedTag = computed(() => {
	const tagParam = route.params.tag as string | undefined;

	if (!tagParam) {
		return '';
	}

	try {
		return decodeURIComponent(tagParam);
	} catch (error) {
		return tagParam;
	}
});

const formattedTagLabel = computed(() => formatTagLabel(decodedTag.value));

const fetchPostsForTag = async () => {
	const tag = decodedTag.value;

	if (!tag) {
		posts.value = [];
		isLoading.value = false;
		return;
	}

	isLoading.value = true;

	try {
		const response: PostsCollectionResponse = await apiStore.getPosts({ tag });
		posts.value = (response.data ?? []) as PostResponse[];
	} catch (error) {
		debugError(error);
		posts.value = [];
	} finally {
		isLoading.value = false;
	}
};

watch(
	() => decodedTag.value,
	() => {
		fetchPostsForTag();
	},
	{ immediate: true },
);
</script>
