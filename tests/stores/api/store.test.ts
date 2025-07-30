import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useApiStore } from '@api/store.ts';

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
}

describe('useApiStore', () => {
	let store: ReturnType<typeof useApiStore>;
	let client: FakeClient;

	beforeEach(() => {
		setActivePinia(createPinia());
		store = useApiStore();
		client = new FakeClient();
		store.client = client as any;
	});

	it('sets search term', () => {
		store.setSearchTerm('vue');
		expect(store.searchTerm).toBe('vue');
	});

	it('boots in dev mode', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
		store.boot();
		expect(spy).toHaveBeenCalledWith('API client booted ...');
		spy.mockRestore();
	});

	it('gets profile', async () => {
		client.get.mockResolvedValue({ data: { name: 'gus' } });
		const res = await store.getProfile();
		expect(res).toEqual({ data: { name: 'gus' } });
	});

	it('handles profile errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getProfile()).rejects.toThrow('parsed');
	});

	it('gets categories', async () => {
		client.get.mockResolvedValue({ list: [] });
		const res = await store.getCategories();
		expect(res).toEqual({ list: [] });
	});

	it('handles category errors', async () => {
		client.get.mockRejectedValue(new Error('fail'));
		await expect(store.getCategories()).rejects.toThrow('parsed');
	});

	it('gets posts', async () => {
		client.post.mockResolvedValue({ list: [] });
		const res = await store.getPosts({});
		expect(res).toEqual({ list: [] });
	});

	it('handles posts errors', async () => {
		client.post.mockRejectedValue(new Error('nope'));
		await expect(store.getPosts({})).rejects.toThrow('parsed');
	});

	it('gets single post', async () => {
		client.get.mockResolvedValue({ slug: 'a' });
		const res = await store.getPost('a');
		expect(res).toEqual({ slug: 'a' });
	});

        it('handles single post errors', async () => {
                client.get.mockRejectedValue(new Error('x'));
                await expect(store.getPost('b')).rejects.toThrow('parsed');
        });

        it('gets experience', async () => {
                client.get.mockResolvedValue({ exp: true });
                const res = await store.getExperience();
                expect(res).toEqual({ exp: true });
        });

        it('handles experience errors', async () => {
                client.get.mockRejectedValue(new Error('fail'));
                await expect(store.getExperience()).rejects.toThrow('parsed');
        });

        it('gets recommendations', async () => {
                client.get.mockResolvedValue({ list: ['a'] });
                const res = await store.getRecommendations();
                expect(res).toEqual({ list: ['a'] });
        });

        it('handles recommendations errors', async () => {
                client.get.mockRejectedValue(new Error('fail'));
                await expect(store.getRecommendations()).rejects.toThrow('parsed');
        });

        it('gets projects', async () => {
                client.get.mockResolvedValue({ list: [1] });
                const res = await store.getProjects();
                expect(res).toEqual({ list: [1] });
        });

        it('handles projects errors', async () => {
                client.get.mockRejectedValue(new Error('fail'));
                await expect(store.getProjects()).rejects.toThrow('parsed');
        });

        it('gets talks', async () => {
                client.get.mockResolvedValue({ list: [] });
                const res = await store.getTalks();
                expect(res).toEqual({ list: [] });
        });

        it('handles talks errors', async () => {
                client.get.mockRejectedValue(new Error('fail'));
                await expect(store.getTalks()).rejects.toThrow('parsed');
        });

        it('gets social', async () => {
                client.get.mockResolvedValue({ list: [] });
                const res = await store.getSocial();
                expect(res).toEqual({ list: [] });
        });

        it('handles social errors', async () => {
                client.get.mockRejectedValue(new Error('fail'));
                await expect(store.getSocial()).rejects.toThrow('parsed');
        });

        it('gets education', async () => {
                client.get.mockResolvedValue({ list: [] });
                const res = await store.getEducation();
                expect(res).toEqual({ list: [] });
        });

        it('handles education errors', async () => {
                client.get.mockRejectedValue(new Error('fail'));
                await expect(store.getEducation()).rejects.toThrow('parsed');
        });
});
