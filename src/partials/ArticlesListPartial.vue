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
			<ArticleItem v-for="item in items" :key="item.id" :item="item" />
		</div>
	</section>
</template>

<script>
import { ref } from 'vue';

import ArticleItemPartial from '@partials/ArticleItemPartial.vue';

import Post01 from '@images/post-thumb-01.jpg';
import Post02 from '@images/post-thumb-02.jpg';
import Post03 from '@images/post-thumb-03.jpg';
import Post04 from '@images/post-thumb-04.jpg';
import Post05 from '@images/post-thumb-05.jpg';
import Post06 from '@images/post-thumb-06.jpg';
import Post07 from '@images/post-thumb-07.jpg';
import Post08 from '@images/post-thumb-08.jpg';

export default {
	name: 'ArticlesListPartial',
	components: {
		ArticleItem: ArticleItemPartial,
	},
	setup() {
		const items = ref([
			{
				id: 0,
				title: 'An Interactive Guide to Flexbox',
				slug: '/post',
				image: Post01,
				date: 'Dec 24, 2023',
				excerpt: 'Flexbox is a remarkably flexible layout mode. When we understand how it works, we can build responsive designs that rearrange themselves as needed.',
			},
			{
				id: 1,
				title: 'Fuzzy Logic in a Hurry',
				slug: '/post',
				image: Post02,
				date: 'Dec 24, 2023',
				excerpt: 'Flexbox is a remarkably flexible layout mode. When we understand how it works, we can build responsive designs that rearrange themselves as needed.',
			},
			{
				id: 2,
				title: 'Machine Learning for Humans',
				slug: '/post',
				image: Post03,
				date: 'Dec 24, 2023',
				excerpt: 'Flexbox is a remarkably flexible layout mode. When we understand how it works, we can build responsive designs that rearrange themselves as needed.',
			},
			{
				id: 3,
				title: 'Writing My First Security Blogpost',
				slug: '/post',
				image: Post04,
				date: 'Dec 24, 2023',
				excerpt: 'Flexbox is a remarkably flexible layout mode. When we understand how it works, we can build responsive designs that rearrange themselves as needed.',
			},
			{
				id: 4,
				title: '10 YouTube Channels That Will Make You Smarter',
				slug: '/post',
				image: Post05,
				date: 'Dec 24, 2023',
				excerpt: 'Flexbox is a remarkably flexible layout mode. When we understand how it works, we can build responsive designs that rearrange themselves as needed.',
			},
			{
				id: 5,
				title: 'How to Control CSS Animations with JavaScript',
				slug: '/post',
				image: Post06,
				date: 'Dec 24, 2023',
				excerpt: 'Flexbox is a remarkably flexible layout mode. When we understand how it works, we can build responsive designs that rearrange themselves as needed.',
			},
			{
				id: 6,
				title: "Lies You've Been Told About Podcasting",
				slug: '/post',
				image: Post07,
				date: 'Dec 24, 2023',
				excerpt: 'Flexbox is a remarkably flexible layout mode. When we understand how it works, we can build responsive designs that rearrange themselves as needed.',
			},
			{
				id: 7,
				title: 'How to Extend Prototypes with JavaScript',
				slug: '/post',
				image: Post08,
				date: 'Dec 24, 2023',
				excerpt: 'Flexbox is a remarkably flexible layout mode. When we understand how it works, we can build responsive designs that rearrange themselves as needed.',
			},
		]);

		return {
			items,
		};
	},
};
</script>
