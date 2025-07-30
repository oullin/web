<template>
	<section>
		<h2 class="mb-5 font-aspekta text-slate-700 dark:text-slate-300 text-xl font-[650]">Latest Articles</h2>

		<!-- Filters -->
		<ul class="flex flex-wrap text-sm border-b border-slate-100 dark:border-slate-800">
			<li v-for="category in categories" :key="category.uuid" class="px-3 -mb-px">
				<a
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
		<div v-if="items.length > 0">
			<ArticleItemPartial v-for="item in items" :key="item.uuid" :item="item" />
		</div>
	</section>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { onMounted, reactive, ref, watch } from 'vue';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import type { PostResponse, PostsCollectionResponse, PostsFilters } from '@api/response/index.ts';
import type { CategoriesCollectionResponse, CategoryResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const items = ref<PostResponse[]>([]);

const categoriesCollection = ref<CategoriesCollectionResponse>();
const categories = ref<CategoryResponse[]>([]);

const selectCategory = (categorySlug: string) => {
	filters.category = categorySlug;
};

const filters = reactive<PostsFilters>({
	category: '',
	text: '',
});

const fetchPosts = async () => {
	try {
		const collection: PostsCollectionResponse = await apiStore.getPosts(filters);

		items.value = collection.data as PostResponse[];
	} catch (error) {
		debugError(error);
	}
};

// --- Categories' Filter:
watch(
	() => filters.category,
	debounce(() => {
		fetchPosts();
	}, 500),
);

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
