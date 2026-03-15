import { createRouter, createWebHistory, Router, RouterScrollBehavior } from 'vue-router';
import { TERMS_AND_POLICIES_PATH } from '@/support/routes';

const routerHistory = createWebHistory();

const scrollBehavior: RouterScrollBehavior = (to) => {
	if (to.hash) {
		return { el: to.hash, behavior: 'smooth' };
	}

	const el: HTMLElement | null = document.querySelector('html');

	if (el === null) {
		return;
	}

	el.style.scrollBehavior = 'auto';
	window.scroll({ top: 0 });
	el.style.scrollBehavior = '';
};

const router: Router = createRouter({
	scrollBehavior,
	history: routerHistory,
	routes: [
		{
			path: '/',
			name: 'Home',
			component: () => import('@pages/HomePage.vue'),
		},
		{
			path: '/writing',
			name: 'Writing',
			component: () => import('@pages/WritingPage.vue'),
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

		{
			path: TERMS_AND_POLICIES_PATH,
			name: 'TermsAndPolicies',
			component: () => import('@pages/TermsAndPoliciesPage.vue'),
		},
	],
});

export default router;
