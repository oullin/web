import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ApiClient, ApiClientOptions } from '@api/client.ts';
import { HttpError } from '@api/http-error.ts';
import { SignatureResponse } from '@api/response/signature-response.ts';

const options: ApiClientOptions = {
	env: 'development',
	apiKey: 'k',
	apiUsername: 'u',
};

const url = 'http://example.com/';

let client: ApiClient;

beforeEach(() => {
	vi.stubEnv('VITE_API_URL', url);
	vi.stubEnv('VITE_HOST_URL', url);
	client = new ApiClient(options);
	localStorage.clear();
	vi.stubGlobal('fetch', vi.fn());
	vi.spyOn(client as any, 'appendSignature').mockResolvedValue(undefined);
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
});

describe('ApiClient', () => {
	it('detects prod and dev modes', () => {
		expect(client.isProd()).toBe(false);
		expect(client.isDev()).toBe(true);

		const prod = new ApiClient({ ...options, env: 'production' });
		expect(prod.isProd()).toBe(true);
		expect(prod.isDev()).toBe(false);
	});

	it('creates unique 32-character hex nonces', () => {
		const first = client.createNonce();
		const second = client.createNonce();

		expect(first).toMatch(/^[a-f0-9]{32}$/);
		expect(second).toMatch(/^[a-f0-9]{32}$/);
		expect(first).not.toBe(second);
	});

	it('handles post success and error responses', async () => {
		const data = { ok: true };
		(fetch as vi.Mock).mockResolvedValue(new Response(JSON.stringify(data), { status: 200 }));

		const result = await client.post('test', { id: 1 });
		expect(result).toEqual(data);

		(fetch as vi.Mock).mockResolvedValue(new Response('fail', { status: 500, statusText: 'err' }));

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
		(fetch as vi.Mock).mockResolvedValue(new Response('nope', { status: 404, statusText: 'NF' }));

		await expect(client.get('oops')).rejects.toBeInstanceOf(HttpError);
	});

	it('retries signature once when clock skew is detected and refreshes timestamp', async () => {
		const serverDate = new Date('2025-01-01T00:00:00Z').toUTCString();
		const realClient = new ApiClient(options);
		const fetchMock = fetch as vi.Mock;

		fetchMock.mockReset();
		fetchMock.mockResolvedValueOnce(new Response('unauthorized', { status: 401, headers: { Date: serverDate } }));
		fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ signature: 'sig-1' }), { status: 200, headers: { Date: serverDate } }));

		const headers = new Headers();

		await (realClient as any).appendSignature('nonce-1', headers, `${url}profile`);

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(headers.get('X-API-Signature')).toBe('sig-1');
		expect(headers.get('X-API-Timestamp')).not.toBeNull();
	});

	it('applies Cristian RTT compensation when latency is acceptable', () => {
		const realClient = new ApiClient(options);
		const now = 1_700_000_000_000;
		const startTime = now - 200;
		const dateHeader = new Date(now).toUTCString();

		vi.spyOn(Date, 'now').mockReturnValue(now);

		(realClient as any).syncClockOffset(new Response(null, { headers: { Date: dateHeader } }), startTime);

		expect((realClient as any).clockOffsetMs).toBe(100);
		expect((realClient as any).getCurrentTimestamp()).toBe(Math.floor((now + 100) / 1000));
	});

	it('ignores clock sync on high-latency responses', () => {
		const realClient = new ApiClient(options);
		const now = 1_700_000_000_000;
		const startTime = now - 2_000; // RTT 2s
		const dateHeader = new Date(now).toUTCString();

		vi.spyOn(Date, 'now').mockReturnValue(now);

		(realClient as any).syncClockOffset(new Response(null, { headers: { Date: dateHeader } }), startTime);

		expect((realClient as any).clockOffsetMs).toBe(0);
	});

	it('ignores stale cache Date headers during sync', () => {
		const realClient = new ApiClient(options);
		const now = 1_700_000_000_000;
		const startTime = now - 50;
		const staleDate = new Date(now - 120_000).toUTCString();

		vi.spyOn(Date, 'now').mockReturnValue(now);

		(realClient as any).syncClockOffset(new Response(null, { headers: { Date: staleDate } }), startTime);

		expect((realClient as any).clockOffsetMs).toBe(0);
	});

	it('refreshes timestamp immediately before attaching signature', async () => {
		const realClient = new ApiClient(options);
		const getSignatureSpy = vi.spyOn(realClient as any, 'getSignature').mockResolvedValue({ signature: 'sig-2' } as SignatureResponse);
		const refreshSpy = vi.spyOn(realClient as any, 'refreshTimestamp');
		const now = 9_000;

		vi.spyOn(Date, 'now').mockReturnValue(now);

		const headers = new Headers({ 'X-API-Timestamp': '0' });

		await (realClient as any).appendSignature('nonce-2', headers, `${url}profile`);

		expect(getSignatureSpy).toHaveBeenCalledTimes(1);
		expect(refreshSpy).toHaveBeenCalledTimes(1);
		expect(refreshSpy.mock.invocationCallOrder[0]).toBeGreaterThan(getSignatureSpy.mock.invocationCallOrder[0]);
		expect(headers.get('X-API-Timestamp')).toBe(String(Math.floor(now / 1000)));
		expect(headers.get('X-API-Signature')).toBe('sig-2');
	});

	it('passes request start times into syncClockOffset for POST', async () => {
		const syncSpy = vi.spyOn(client as any, 'syncClockOffset');
		(fetch as vi.Mock).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { Date: new Date().toUTCString() } }));
		vi.spyOn(Date, 'now').mockReturnValue(5_000);

		await client.post('test', { a: 1 });

		expect(syncSpy).toHaveBeenCalledTimes(1);
		expect(syncSpy.mock.calls[0][1]).toBe(5_000);
	});

	it('passes request start times into syncClockOffset for GET', async () => {
		const syncSpy = vi.spyOn(client as any, 'syncClockOffset');
		(fetch as vi.Mock).mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { Date: new Date().toUTCString() } }));
		vi.spyOn(Date, 'now').mockReturnValue(10_000);

		await client.get('test');

		expect(syncSpy).toHaveBeenCalledTimes(1);
		expect(syncSpy.mock.calls[0][1]).toBe(10_000);
	});
});
