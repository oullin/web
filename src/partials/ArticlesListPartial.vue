<template>
	<section>
		<h2 class="mb-5 font-aspekta text-slate-700 dark:text-slate-300 text-xl font-[650]">Latest Articles</h2>

		<!-- Filters -->
		<ul class="flex flex-wrap text-sm border-b border-slate-100 dark:border-slate-800">
			<li v-for="category in categories" :key="category.uuid" class="px-3 -mb-px">
				<a class="block py-3 font-medium text-slate-500 border-b-2 border-fuchsia-500 dark:text-slate-300 dark:border-teal-500" href="#">{{ category.name }}</a>
			</li>
		</ul>

		<!-- Articles list -->
		<div v-if="items.length > 0">
			<ArticleItemPartial v-for="item in items" :key="item.uuid" :item="item" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import type { PostResponse, PostsCollectionResponse } from '@api/response/posts-response.ts';
import { CategoriesCollectionResponse, CategoryResponse } from '@api/response/categories-response.ts';

const apiStore = useApiStore();

const collection = ref<PostsCollectionResponse>();
const items = ref<PostResponse[]>([]);

const categoriesCollection = ref<CategoriesCollectionResponse>();
const categories = ref<CategoryResponse[]>([]);

onMounted(async () => {
	try {
		collection.value = await apiStore.getPosts();
		items.value = collection.value.data as PostResponse[];

		categoriesCollection.value = await apiStore.getCategories();
		categories.value = categoriesCollection.value.data as CategoryResponse[];
	} catch (error) {
		debugError(error);
	}
});
</script>
