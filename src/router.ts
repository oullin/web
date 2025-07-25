import HomePage from '@pages/HomePage.vue';
import PostPage from '@pages/PostPage.vue';
import AboutPage from '@pages/AboutPage.vue';
import ResumePage from '@pages/ResumePage.vue';
import ProjectsPage from '@pages/ProjectsPage.vue';
import SubscribePage from '@pages/SubscribePage.vue';
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
			component: HomePage,
		},
		{
			path: '/post/:slug',
			name: 'PostDetail',
			component: PostPage,
		},
		{
			path: '/about',
			component: AboutPage,
		},
		{
			path: '/projects',
			component: ProjectsPage,
		},
		{
			path: '/resume',
			component: ResumePage,
		},
		{
			path: '/subscribe',
			component: SubscribePage,
		},
	],
});

export default router;
