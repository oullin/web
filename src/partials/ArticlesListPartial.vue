<template>
	<section>
		<h2 class="mb-5 font-aspekta text-slate-700 dark:text-slate-300 text-xl font-[650]">Latest Articles</h2>

		<!-- Filters -->
		<ul class="flex flex-wrap text-sm border-b border-slate-100 dark:border-slate-800">
			<li v-for="category in categories" :key="category.uuid" class="px-3 -mb-px">
				<a
					v-lazy-link
					href="#"
					:class="
						filters.category === category.slug
							? 'text-slate-800 border-fuchsia-500 dark:text-slate-200 dark:border-teal-500'
							: 'text-slate-500 border-transparent hover:border-slate-300 dark:text-slate-300 dark:hover:border-slate-700'
					"
					class="block py-3 font-medium border-b-2"
					@click.prevent="selectCategory(category.slug)"
					>{{ category.name }}</a
				>
			</li>
		</ul>

		<!-- Articles list -->
		<div v-if="isLoading" aria-busy="true">
			<ArticleItemSkeletonPartial v-for="skeleton in skeletonCount" :key="`article-skeleton-${skeleton}`" />
		</div>
		<div v-else-if="items.length > 0">
			<ArticleItemPartial v-for="item in items" :key="item.uuid" :item="item" />
		</div>
	</section>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import ArticleItemSkeletonPartial from '@partials/ArticleItemSkeletonPartial.vue';
import type { PostResponse, PostsCollectionResponse, PostsFilters } from '@api/response/index.ts';
import type { CategoriesCollectionResponse, CategoryResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const items = ref<PostResponse[]>([]);
const isLoading = ref(false);
const DEFAULT_SKELETON_COUNT = 3;
const skeletonCount = ref(DEFAULT_SKELETON_COUNT);

const categoriesCollection = ref<CategoriesCollectionResponse>();
const categories = ref<CategoryResponse[]>([]);

const selectCategory = (categorySlug: string) => {
	filters.category = categorySlug;
};

const filters = reactive<PostsFilters>({
	category: '',
	text: '',
});

let lastRequestId = 0;

const skeletonCountFor = (list: PostResponse[]) => (list.length > 0 ? list.length : DEFAULT_SKELETON_COUNT);

const fetchPosts = async () => {
	const requestId = ++lastRequestId;

	const previousItems = items.value;
	skeletonCount.value = skeletonCountFor(previousItems);
	items.value = [];
	isLoading.value = true;

	try {
		const collection: PostsCollectionResponse = await apiStore.getPosts(filters);

		if (requestId !== lastRequestId) {
			return;
		}

		items.value = collection.data as PostResponse[];
	} catch (error) {
		debugError(error);
		if (requestId === lastRequestId) {
			items.value = previousItems;
		}
	} finally {
		if (requestId === lastRequestId) {
			skeletonCount.value = skeletonCountFor(items.value);
			isLoading.value = false;
		}
	}
};

// --- Categories' Filter:
const debouncedFetchPosts = debounce(
	() => {
		fetchPosts();
	},
	500,
	{ leading: true, trailing: true },
);

watch(
	() => filters.category,
	() => {
		debouncedFetchPosts();
	},
);

onBeforeUnmount(() => {
	debouncedFetchPosts.cancel();
});

// --- Search: filter post by the given search criteria.
watch(
	() => apiStore.searchTerm,
	(newSearchTerm: string): void => {
		filters.text = newSearchTerm.trim();
		fetchPosts();
	},
);

// --- Mount the Vue component
onMounted(async () => {
	try {
		categoriesCollection.value = await apiStore.getCategories();
		categories.value = categoriesCollection.value.data as CategoryResponse[];

		if (categories.value.length > 0) {
			filters.category = categories.value[0].slug;

			await fetchPosts();
		}
	} catch (error) {
		debugError(error);
	}
});
</script>
