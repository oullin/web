import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';
import { createArchiveNavigationGuard } from '@support/archive-navigation';

const setup = async (initialPath = '/') => {
	const navigate = vi.fn();
	const component = { template: '<div />' };
	const router = createRouter({
		history: createMemoryHistory(),
		routes: [
			{ path: '/', name: 'Home', component },
			{ path: '/writing', name: 'Writing', component },
			{ path: '/tags/:tag', name: 'TagPosts', component },
			{ path: '/post/:slug', name: 'PostDetail', component },
			{ path: '/about', name: 'About', component },
			{ path: '/contact', name: 'Contact', component },
			{ path: '/projects', name: 'Projects', component },
		],
	});
	router.beforeEach(createArchiveNavigationGuard(navigate));
	await router.push(initialPath);
	return { router, navigate };
};

describe('writing archive navigation', () => {
	it.each(['/writing', '/writing/', '/writing?category=go', '/tags/go'])('sends %s to the migrated archive', async (path) => {
		const { router, navigate } = await setup();
		await router.push(path);
		expect(navigate).toHaveBeenCalledWith('https://writing.gocanto.sh/');
		expect(router.currentRoute.value.name).toBe('Home');
	});

	it('uses a document request for the canonical legacy post redirect, preserving query and hash', async () => {
		const { router, navigate } = await setup();
		const path = '/post/2025-10-15-building-oullin?source=nav#architecture';
		await router.push({ name: 'PostDetail', params: { slug: '2025-10-15-building-oullin' }, query: { source: 'nav' }, hash: '#architecture' });
		expect(navigate).toHaveBeenCalledWith(path);
		expect(router.currentRoute.value.name).toBe('Home');
	});

	it('does not loop on a direct request for an unmapped post', async () => {
		const { router, navigate } = await setup('/post/unmapped-post');
		expect(navigate).not.toHaveBeenCalled();
		expect(router.currentRoute.value.name).toBe('PostDetail');
	});

	it.each(['/about', '/contact', '/projects'])('keeps %s in the SPA', async (path) => {
		const { router, navigate } = await setup();
		await router.push(path);
		expect(navigate).not.toHaveBeenCalled();
		expect(router.currentRoute.value.path).toBe(path);
	});
});
