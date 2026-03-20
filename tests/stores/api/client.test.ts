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
