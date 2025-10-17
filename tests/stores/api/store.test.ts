import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useApiStore } from '@api/store.ts';
import type { ApiClient } from '@api/client.ts';
import type { SocialResponse } from '@api/response/index.ts';

vi.mock('@api/http-error.ts', async () => {
	const mod = await vi.importActual<typeof import('@api/http-error.ts')>('@api/http-error.ts');
	return {
		...mod,
		parseError: vi.fn(() => Promise.reject(new Error('parsed'))),
	};
});

class FakeClient {
	isDev = vi.fn(() => true);
	get = vi.fn();
	post = vi.fn();
	createNonce = vi.fn(() => 'nonce');
}

describe('useApiStore', () => {
	let store: ReturnType<typeof useApiStore>;
	let client: FakeClient;

	beforeEach(() => {
		setActivePinia(createPinia());
		store = useApiStore();
		client = new FakeClient();
		store.client = client as unknown as ApiClient;
	});

	it('sets search term', () => {
		store.setSearchTerm('vue');
		expect(store.searchTerm).toBe('vue');
	});

	it('boots in dev mode', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
		store.boot();
		expect(client.isDev).toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith('API client booted ...');
		spy.mockRestore();
	});

	it('gets profile', async () => {
		client.get.mockResolvedValue({ data: { name: 'gus' } });
		const res = await store.getProfile();
		expect(client.get).toHaveBeenCalledWith('profile');
		expect(res).toEqual({ data: { name: 'gus' } });
	});

	it('handles profile errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getProfile()).rejects.toThrow('parsed');
	});

	it('gets categories', async () => {
		client.get.mockResolvedValue({ list: [] });
		const res = await store.getCategories();
		expect(client.get).toHaveBeenCalledWith('categories?limit=5');
		expect(res).toEqual({ list: [] });
	});

	it('handles category errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getCategories()).rejects.toThrow('parsed');
	});

	it('gets posts', async () => {
		const filters = {};
		client.post.mockResolvedValue({ list: [] });
		const res = await store.getPosts(filters);
		expect(client.post).toHaveBeenCalledWith('posts?limit=5', filters);
		expect(res).toEqual({ list: [] });
	});

	it('handles posts errors', async () => {
		client.post.mockRejectedValue(new Error('nope'));
		await expect(store.getPosts({})).rejects.toThrow('parsed');
	});

	it('gets single post', async () => {
		client.get.mockResolvedValue({ slug: 'a' });
		const res = await store.getPost('a');
		expect(client.get).toHaveBeenCalledWith('posts/a');
		expect(res).toEqual({ slug: 'a' });
	});

	it('handles single post errors', async () => {
		client.get.mockRejectedValue(new Error('x'));
		await expect(store.getPost('b')).rejects.toThrow('parsed');
	});

	it('gets experience', async () => {
		client.get.mockResolvedValue({ exp: true });
		const res = await store.getExperience();
		expect(client.get).toHaveBeenCalledWith('experience');
		expect(res).toEqual({ exp: true });
	});

	it('handles experience errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getExperience()).rejects.toThrow('parsed');
	});

	it('gets recommendations', async () => {
		client.get.mockResolvedValue({ list: ['a'] });
		const res = await store.getRecommendations();
		expect(client.get).toHaveBeenCalledWith('recommendations');
		expect(res).toEqual({ list: ['a'] });
	});

	it('handles recommendations errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getRecommendations()).rejects.toThrow('parsed');
	});

	it('gets projects', async () => {
		client.get.mockResolvedValue({ list: [1] });
		const res = await store.getProjects();
		expect(client.get).toHaveBeenCalledWith('projects');
		expect(res).toEqual({ list: [1] });
	});

	it('handles projects errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getProjects()).rejects.toThrow('parsed');
	});

	it('gets talks', async () => {
		client.get.mockResolvedValue({ list: [] });
		const res = await store.getTalks();
		expect(client.get).toHaveBeenCalledWith('talks');
		expect(res).toEqual({ list: [] });
	});

	it('handles talks errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getTalks()).rejects.toThrow('parsed');
	});

	it('gets social', async () => {
		client.get.mockResolvedValue({ list: [] });
		const res = await store.getSocial();
		expect(client.get).toHaveBeenCalledWith('social');
		expect(res).toEqual({ list: [] });
	});

	it('handles social errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getSocial()).rejects.toThrow('parsed');
	});

	it('fetches and caches social links', async () => {
		const socialData: SocialResponse[] = [
			{
				uuid: 'uuid-1',
				name: 'github',
				url: 'https://github.example.com',
				handle: 'github-handle',
				description: 'GitHub profile',
			},
		];

		client.get.mockResolvedValue({ data: socialData, version: '1.0.0' });

		const fetched = await store.fetchSocial();

		expect(client.get).toHaveBeenCalledWith('social');
		expect(fetched).toEqual(socialData);
		expect(store.social).toEqual(socialData);

		client.get.mockClear();

		const cached = await store.fetchSocial();

		expect(client.get).not.toHaveBeenCalled();
		expect(cached).toEqual(socialData);
	});

	it('forces a refetch of social links when requested', async () => {
		const firstResponse: SocialResponse[] = [
			{
				uuid: 'uuid-1',
				name: 'github',
				url: 'https://github.example.com',
				handle: 'github-handle',
				description: 'GitHub profile',
			},
		];

		const secondResponse: SocialResponse[] = [
			{
				uuid: 'uuid-2',
				name: 'linkedin',
				url: 'https://linkedin.example.com',
				handle: 'linkedin-handle',
				description: 'LinkedIn profile',
			},
		];

		client.get.mockResolvedValueOnce({ data: firstResponse, version: '1.0.0' }).mockResolvedValueOnce({ data: secondResponse, version: '1.0.0' });

		await store.fetchSocial();

		const forced = await store.fetchSocial(true);

		expect(client.get).toHaveBeenCalledTimes(2);
		expect(forced).toEqual(secondResponse);
		expect(store.social).toEqual(secondResponse);
	});

	it('propagates errors when fetching social links', async () => {
		client.get.mockRejectedValue(new Error('fail'));

		await expect(store.fetchSocial()).rejects.toThrow('parsed');
	});

	it('gets education', async () => {
		client.get.mockResolvedValue({ list: [] });
		const res = await store.getEducation();
		expect(client.get).toHaveBeenCalledWith('education');
		expect(res).toEqual({ list: [] });
	});

	it('handles education errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getEducation()).rejects.toThrow('parsed');
	});
});
