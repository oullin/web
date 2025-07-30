import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ApiClient, ApiClientOptions } from '@api/client.ts';
import { HttpError } from '@api/http-error.ts';

const options: ApiClientOptions = {
	env: 'development',
	apiKey: 'k',
	apiUsername: 'u',
	apiSignature: 's',
};

const url = 'http://example.com/';

// Ensure environment variable for base url
process.env.VITE_API_URL = url;

let client: ApiClient;

beforeEach(() => {
	client = new ApiClient(options);
	localStorage.clear();
	vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('ApiClient', () => {
        it('detects prod and dev modes', () => {
                expect(client.isProd()).toBe(false);
                expect(client.isDev()).toBe(true);

                const prod = new ApiClient({ ...options, env: 'production' });
                expect(prod.isProd()).toBe(true);
                expect(prod.isDev()).toBe(false);
        });

	it('handles post success and error responses', async () => {
		const data = { ok: true };
               (fetch as vi.Mock).mockResolvedValue(
                       new Response(JSON.stringify(data), { status: 200 }),
               );

		const result = await client.post('test', { id: 1 });
		expect(result).toEqual(data);

               (fetch as vi.Mock).mockResolvedValue(
                       new Response('fail', { status: 500, statusText: 'err' }),
               );

		await expect(client.post('test', { id: 2 })).rejects.toBeInstanceOf(HttpError);
	});

	it('caches get requests and serves from cache', async () => {
		// prefill cache
		const cacheKey = 'api-cache-test';
		localStorage.setItem(cacheKey, JSON.stringify({ etag: 'x', data: { cached: true } }));

               (fetch as vi.Mock).mockResolvedValue(new Response(null, { status: 304 }));

		const result = await client.get('test');
		expect(result).toEqual({ cached: true });
	});

        it('stores response with etag in cache', async () => {
                const data = { foo: 'bar' };
               (fetch as vi.Mock).mockResolvedValue(
                        new Response(JSON.stringify(data), {
                                status: 200,
                                headers: { ETag: 'abc' },
                        }),
                );

                const result = await client.get('test');
                expect(result).toEqual(data);
                expect(localStorage.getItem('api-cache-test')).not.toBeNull();
        });

        it('throws HttpError on failed get', async () => {
               (fetch as vi.Mock).mockResolvedValue(
                       new Response('nope', { status: 404, statusText: 'NF' }),
               );

                await expect(client.get('oops')).rejects.toBeInstanceOf(HttpError);
        });
});
