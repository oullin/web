import { createRouter as _createRouter, createMemoryHistory, createWebHistory } from 'vue-router';

export function createRouter() {
	return _createRouter({
		// --- Automatically selects the correct history mode for server/client.
		history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),

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

		scrollBehavior(to) {
			// This logic is for the browser only and will be skipped on the server.
			if (typeof window === 'undefined') {
				return;
			}

			if (to.hash) {
				window.scroll({ top: 0 });
			} else {
				const el = document.querySelector('html');
				if (el) {
					el.style.scrollBehavior = 'auto';
					window.scroll({ top: 0 });
					el.style.scrollBehavior = '';
				}
			}
		},
	});
}
