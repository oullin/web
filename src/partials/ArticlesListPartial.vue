<template>
	<section>
		<h2 class="mb-5 font-aspekta text-slate-700 dark:text-slate-300 text-xl font-[650]">Latest Articles</h2>

		<!-- Filters -->
		<ul class="flex flex-wrap text-sm border-b border-slate-100 dark:border-slate-800">
			<li class="px-3 -mb-px">
				<a class="block py-3 font-medium text-slate-500 border-b-2 border-fuchsia-500 dark:text-slate-300 dark:border-teal-500" href="#">Coding</a>
			</li>
			<li class="px-3 -mb-px">
				<a class="block py-3 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300" href="#">Startups</a>
			</li>
			<li class="px-3 -mb-px">
				<a class="block py-3 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300" href="#">Tutorials</a>
			</li>
			<li class="px-3 -mb-px">
				<a class="block py-3 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300" href="#">Indie Hacking</a>
			</li>
		</ul>

		<!-- Articles list -->
		<div>
			<ArticleItemPartial v-for="item in items" :key="item.id" :item="item" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import ArticleItemPartial from '@partials/ArticleItemPartial.vue';
import type { PostsResponse } from '@api/response/posts-response.ts';

const apiStore = useApiStore();
const items = ref<PostsResponse[]>([]);

onMounted(async () => {
	try {
		items.value = (await apiStore.getPosts()).data as PostsResponse;
	} catch (error) {
		debugError(error);
	}
});
</script>
