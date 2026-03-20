import { createRouter, createWebHistory, Router } from 'vue-router';
import { scrollBehavior } from '@support/scrolls';

const routerHistory = createWebHistory();

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
			name: 'About',
			component: () => import('@pages/AboutPage.vue'),
		},
		{
			path: '/contact',
			name: 'Contact',
			component: () => import('@pages/ContactPage.vue'),
		},
		{
			path: '/work-with-us',
			name: 'WorkWithUs',
			component: () => import('@pages/WorkWithUsPage.vue'),
		},
		{
			path: '/projects',
			component: () => import('@pages/ProjectsPage.vue'),
		},
		{
			path: '/terms-and-conditions',
			name: 'TermsAndPolicies',
			component: () => import('@pages/TermsAndPoliciesPage.vue'),
		},
	],
});

export default router;
