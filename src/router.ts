import { createRouter, createWebHistory, Router } from 'vue-router';

const routerHistory = createWebHistory();

const router: Router = createRouter({
	scrollBehavior(to): void {
		if (to.hash) {
			window.scroll({ top: 0 });
		} else {
			const el: HTMLElement | null = document.querySelector('html');

			if (el === null) {
				return;
			}

			el.style.scrollBehavior = 'auto';
			window.scroll({ top: 0 });
			el.style.scrollBehavior = '';
		}
	},
	history: routerHistory,
	routes: [
		{
			path: '/',
			component: () => import('@pages/HomePage.vue'),
		},
		{
			path: '/post/:slug',
			name: 'PostDetail',
			component: () => import('@pages/PostPage.vue'),
		},
		{
			path: '/tags/:tag',
			name: 'TagPosts',
			component: () => import('@pages/TagPostsPage.vue'),
		},
		{
			path: '/about',
			component: () => import('@pages/AboutPage.vue'),
		},
		{
			path: '/projects',
			component: () => import('@pages/ProjectsPage.vue'),
		},
		{
			path: '/resume',
			component: () => import('@pages/ResumePage.vue'),
		},
	],
});

export default router;
