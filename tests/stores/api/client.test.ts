import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from '@api/client.ts';

const signatureResponse = () =>
	new Response(JSON.stringify({ signature: 'signed' }), {
		status: 200,
		headers: { Date: new Date().toUTCString() },
	});

const jsonResponse = (payload: unknown, headers: Record<string, string> = {}) =>
	new Response(JSON.stringify(payload), {
		status: 200,
		headers: {
			Date: new Date().toUTCString(),
			...headers,
		},
	});

describe('ApiClient.get', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		localStorage.clear();
	});

	it('deduplicates concurrent GET requests for the same URL', async () => {
		let resolveDataResponse: ((response: Response) => void) | null = null;
		const dataResponsePromise = new Promise<Response>((resolve) => {
			resolveDataResponse = resolve;
		});

		const fetchMock = vi
			.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
			.mockResolvedValueOnce(signatureResponse())
			.mockImplementationOnce(() => dataResponsePromise);

		vi.stubGlobal('fetch', fetchMock);

		const client = new ApiClient({ env: 'development', apiKey: 'public-key', apiUsername: 'oullin' });
		vi.spyOn(client, 'createNonce').mockReturnValue('nonce');
		(client as { basedURL: string }).basedURL = 'https://api.example.com/';

		const firstRequest = client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });
		const secondRequest = client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });

		resolveDataResponse?.(jsonResponse({ data: { email: 'hello@oullin.io' } }, { ETag: '"profile-v1"' }));

		const [first, second] = await Promise.all([firstRequest, secondRequest]);

		expect(first).toEqual(second);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('cleans up in-flight entry on rejection so retries can succeed', async () => {
		const fetchMock = vi
			.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
			.mockResolvedValueOnce(signatureResponse())
			.mockResolvedValueOnce(new Response('Internal Server Error', { status: 500 }))
			.mockResolvedValueOnce(signatureResponse())
			.mockResolvedValueOnce(jsonResponse({ data: { email: 'hello@oullin.io' } }));

		vi.stubGlobal('fetch', fetchMock);

		const client = new ApiClient({ env: 'development', apiKey: 'public-key', apiUsername: 'oullin' });
		vi.spyOn(client, 'createNonce').mockReturnValue('nonce');
		(client as { basedURL: string }).basedURL = 'https://api.example.com/';

		await expect(client.get('profile')).rejects.toThrow();

		const result = await client.get<{ data: { email: string } }>('profile');
		expect(result).toEqual({ data: { email: 'hello@oullin.io' } });
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it('does not populate memory cache from a stale in-flight request after clearMemoryCache', async () => {
		let resolveDataResponse: ((response: Response) => void) | null = null;
		const dataResponsePromise = new Promise<Response>((resolve) => {
			resolveDataResponse = resolve;
		});

		const fetchMock = vi
			.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
			.mockResolvedValueOnce(signatureResponse())
			.mockImplementationOnce(() => dataResponsePromise)
			.mockResolvedValueOnce(signatureResponse())
			.mockResolvedValueOnce(jsonResponse({ data: { email: 'fresh@oullin.io' } }));

		vi.stubGlobal('fetch', fetchMock);

		const client = new ApiClient({ env: 'development', apiKey: 'public-key', apiUsername: 'oullin' });
		vi.spyOn(client, 'createNonce').mockReturnValue('nonce');
		(client as { basedURL: string }).basedURL = 'https://api.example.com/';

		const staleRequest = client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });

		client.clearMemoryCache();

		resolveDataResponse?.(jsonResponse({ data: { email: 'stale@oullin.io' } }));
		await staleRequest;

		const freshResult = await client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });

		expect(freshResult).toEqual({ data: { email: 'fresh@oullin.io' } });
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it('populates memory cache when a memoized caller joins a non-memoized in-flight request', async () => {
		let resolveDataResponse: ((response: Response) => void) | null = null;
		const dataResponsePromise = new Promise<Response>((resolve) => {
			resolveDataResponse = resolve;
		});

		const fetchMock = vi
			.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
			.mockResolvedValueOnce(signatureResponse())
			.mockImplementationOnce(() => dataResponsePromise);

		vi.stubGlobal('fetch', fetchMock);

		const client = new ApiClient({ env: 'development', apiKey: 'public-key', apiUsername: 'oullin' });
		vi.spyOn(client, 'createNonce').mockReturnValue('nonce');
		(client as { basedURL: string }).basedURL = 'https://api.example.com/';

		const nonMemoized = client.get<{ data: { email: string } }>('profile');
		const memoized = client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });

		resolveDataResponse?.(jsonResponse({ data: { email: 'hello@oullin.io' } }));

		const [nonMemoizedResult, memoizedResult] = await Promise.all([nonMemoized, memoized]);

		expect(nonMemoizedResult).toEqual(memoizedResult);

		const cachedResult = await client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });

		expect(cachedResult).toEqual({ data: { email: 'hello@oullin.io' } });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('does not evict a replacement in-flight entry when the old request settles after clearMemoryCache', async () => {
		let resolveOldData: ((response: Response) => void) | null = null;
		const oldDataPromise = new Promise<Response>((resolve) => {
			resolveOldData = resolve;
		});

		let resolveNewData: ((response: Response) => void) | null = null;
		const newDataPromise = new Promise<Response>((resolve) => {
			resolveNewData = resolve;
		});

		const fetchMock = vi
			.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
			// old request: signature + data
			.mockResolvedValueOnce(signatureResponse())
			.mockImplementationOnce(() => oldDataPromise)
			// new request after clear: signature + data
			.mockResolvedValueOnce(signatureResponse())
			.mockImplementationOnce(() => newDataPromise);

		vi.stubGlobal('fetch', fetchMock);

		const client = new ApiClient({ env: 'development', apiKey: 'public-key', apiUsername: 'oullin' });
		vi.spyOn(client, 'createNonce').mockReturnValue('nonce');
		(client as { basedURL: string }).basedURL = 'https://api.example.com/';

		// 1. Start first request (registers in inFlightGets)
		const oldRequest = client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });

		// 2. Clear caches (wipes inFlightGets)
		client.clearMemoryCache();

		// 3. Start replacement request for the same URL (re-registers in inFlightGets)
		const newRequest = client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });

		// 4. A third caller joins while the replacement is still in-flight — should deduplicate
		const deduplicatedRequest = client.get<{ data: { email: string } }>('profile', { useMemoryCache: true });

		// 5. Old request settles — its .finally() must NOT evict the replacement
		resolveOldData?.(jsonResponse({ data: { email: 'old@oullin.io' } }));
		await oldRequest;

		// 6. Resolve replacement
		resolveNewData?.(jsonResponse({ data: { email: 'new@oullin.io' } }));
		const [newResult, deduplicatedResult] = await Promise.all([newRequest, deduplicatedRequest]);

		// The deduplicated caller must have shared the replacement promise (same result, no extra fetch)
		expect(newResult).toEqual({ data: { email: 'new@oullin.io' } });
		expect(deduplicatedResult).toEqual(newResult);
		// 4 fetches total: 2 for old request + 2 for replacement. No extra pair for the deduplicated caller.
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it('returns memoized responses for repeated shared GETs in the same session', async () => {
		const fetchMock = vi
			.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
			.mockResolvedValueOnce(signatureResponse())
			.mockResolvedValueOnce(jsonResponse({ data: [{ name: 'github', url: 'https://github.com/oullin' }] }, { ETag: '"links-v1"' }));

		vi.stubGlobal('fetch', fetchMock);

		const client = new ApiClient({ env: 'development', apiKey: 'public-key', apiUsername: 'oullin' });
		vi.spyOn(client, 'createNonce').mockReturnValue('nonce');
		(client as { basedURL: string }).basedURL = 'https://api.example.com/';

		const first = await client.get<{ data: Array<{ name: string; url: string }> }>('links', { useMemoryCache: true });
		const second = await client.get<{ data: Array<{ name: string; url: string }> }>('links', { useMemoryCache: true });

		expect(second).toEqual(first);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});
