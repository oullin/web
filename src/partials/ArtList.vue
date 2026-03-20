<template>
	<section>
		<span class="page-section-label">// latest_articles</span>

		<!-- Filters -->
		<ul class="flex flex-wrap text-sm border-b border-(--border)">
			<li v-for="category in categories" :key="category.uuid" class="px-3 -mb-px">
				<a
					v-lazy-link
					href="#"
					:class="filters.category === category.slug ? 'text-(--text) border-(--violet)' : 'text-(--muted) border-transparent hover:border-(--border)'"
					class="block py-3 font-medium border-b-2 transition-colors"
					@click.prevent="pickCtg(category.slug)"
					>{{ category.name }}</a
				>
			</li>
		</ul>

		<!-- Articles list -->
		<div class="relative min-h-96">
			<div v-if="isLoad" key="skeleton" aria-busy="true" class="min-h-96">
				<ArticleItemSkeletonPartial v-for="skeleton in skelCnt" :key="`article-skeleton-${skeleton}`" />
			</div>
			<div v-else-if="items.length > 0" key="list" class="min-h-96">
				<ArticleItemPartial v-for="(item, index) in items" :key="item.uuid" :item="item" :is-last="index === items.length - 1" />
			</div>
			<p v-else key="empty" class="page-empty-state py-8 min-h-96">No articles found.</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import ArticleItemPartial from '@partials/ArtItem.vue';
import ArticleItemSkeletonPartial from '@partials/ArtItemSk.vue';
import type { PostResponse, PostsCollectionResponse, PostsFilters } from '@api/response/index.ts';
import type { CategoriesCollectionResponse, CategoryResponse } from '@api/response/index.ts';

const api = useApiStore();
const items = ref<PostResponse[]>([]);
const isLoad = ref(false);
const DEFAULT_SKELETON_COUNT = 3;
const skelCnt = ref(DEFAULT_SKELETON_COUNT);

const categsRes = ref<CategoriesCollectionResponse>();
const categories = ref<CategoryResponse[]>([]);

const prevCtg = ref<string>('');

const pickCtg = (ctgSlug: string) => {
	filters.category = ctgSlug;

	if (filters.text) {
		prevCtg.value = ctgSlug;
	}
};

const filters = reactive<PostsFilters>({
	category: '',
	text: '',
});

let lastReq = 0;

const getSkels = (list: PostResponse[]) => (list.length > 0 ? list.length : DEFAULT_SKELETON_COUNT);

const loadPosts = async () => {
	const reqId = ++lastReq;

	const prevItems = items.value;
	skelCnt.value = getSkels(prevItems);
	isLoad.value = true;

	try {
		const collection: PostsCollectionResponse = await api.getPosts(filters);

		if (reqId !== lastReq) {
			return;
		}

		items.value = collection.data as PostResponse[];
	} catch (error) {
		debugError(error);
		if (reqId === lastReq) {
			items.value = prevItems.length > 0 ? prevItems : [];
		}
	} finally {
		if (reqId === lastReq) {
			skelCnt.value = getSkels(items.value);
			isLoad.value = false;
		}
	}
};

// --- Categories' Filter:
const debFetch = debounce(
	() => {
		loadPosts();
	},
	500,
	{ leading: true, trailing: true },
);

const debSearch = debounce(() => {
	loadPosts();
}, 300);

watch(
	() => filters.category,
	() => {
		debFetch();
	},
);

onBeforeUnmount(() => {
	debFetch.cancel();
	debSearch.cancel();
});

// --- Search: filter post by the given search criteria.
watch(
	() => api.searchTerm,
	(nextTerm: string): void => {
		const newText = nextTerm.trim();
		const oldText = filters.text;
		filters.text = newText;

		if (newText && !oldText) {
			// Starting search
			prevCtg.value = filters.category ?? '';
			filters.category = '';
		} else if (!newText && oldText) {
			// Clearing search
			filters.category = prevCtg.value;
			prevCtg.value = '';
		}

		if (!filters.text && !filters.category && categories.value.length > 0) {
			filters.category = categories.value[0].slug;
		}

		debSearch();
	},
);

// --- Mount the Vue component
onMounted(async () => {
	try {
		categsRes.value = await api.getCategories();
		categories.value = categsRes.value.data as CategoryResponse[];

		if (categories.value.length > 0) {
			filters.category = categories.value[0].slug;
		}
	} catch (error) {
		debugError(error);
	}
});
</script>
