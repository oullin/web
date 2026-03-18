import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Links } from '@/support/links.ts';
import type { LinksResponse } from '@api/response';

const { getLinksMock, debugErrorMock } = vi.hoisted(() => ({
	getLinksMock: vi.fn(),
	debugErrorMock: vi.fn(),
}));

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({
		getLinks: getLinksMock,
	}),
}));

vi.mock('@api/http-error.ts', async () => {
	const actual = await vi.importActual<typeof import('@api/http-error.ts')>('@api/http-error.ts');
	return {
		...actual,
		debugError: debugErrorMock,
	};
});

const sampleLinksResponse: LinksResponse[] = [
	{ uuid: '1', name: 'x', handle: '@user', url: 'https://x.com/user', description: 'micro posts' },
	{ uuid: '2', name: 'github', handle: 'user', url: 'https://github.com/user', description: 'repos' },
];

describe('Links.fetch', () => {
	beforeEach(() => {
		getLinksMock.mockReset();
		debugErrorMock.mockReset();
	});

	it('returns API data when available', async () => {
		getLinksMock.mockResolvedValueOnce({ data: sampleLinksResponse });

		const links = new Links();
		const result = await links.fetch();

		expect(getLinksMock).toHaveBeenCalledTimes(1);
		expect(result).toEqual(sampleLinksResponse);
	});

	it('falls back to an empty list when the response lacks data', async () => {
		getLinksMock.mockResolvedValueOnce({ data: undefined });

		const links = new Links();
		const result = await links.fetch();

		expect(result).toEqual([]);
		expect(debugErrorMock).not.toHaveBeenCalled();
	});

	it('logs errors and returns an empty list when the request fails', async () => {
		const error = new Error('network failed');
		getLinksMock.mockRejectedValueOnce(error);

		const links = new Links();
		const result = await links.fetch();

		expect(result).toEqual([]);
		expect(debugErrorMock).toHaveBeenCalledWith(error);
	});
});

describe('Links.buildNavLinks', () => {
	it('ignores unknown platforms and uses provided allowlist', () => {
		const linksResponse: LinksResponse[] = [
			{ uuid: '1', name: 'x', handle: '@user', url: 'https://x.com/user', description: 'micro posts' },
			{ uuid: '2', name: 'github', handle: 'user', url: 'https://github.com/user', description: 'repos' },
			{ uuid: '3', name: 'facebook', handle: 'user', url: 'https://fb.com/user', description: 'legacy' },
		];

		const links = new Links();
		const navLinks = links.buildNavLinks(linksResponse, ['github']);

		expect(navLinks).toHaveLength(1);
		expect(navLinks[0]).toMatchObject({
			href: 'https://github.com/user',
			label: 'Code & Projects',
		});
		expect(navLinks[0].icon).toBeTruthy();
	});

	it('defaults to all configured platforms when allowlist is omitted', () => {
		const linksResponse: LinksResponse[] = [
			{ uuid: '1', name: 'x', handle: '@user', url: 'https://x.com/user', description: 'micro posts' },
			{ uuid: '2', name: 'linkedin', handle: 'user', url: 'https://linkedin.com/in/user', description: 'work' },
		];

		const links = new Links();
		const navLinks = links.buildNavLinks(linksResponse);

		expect(navLinks.map((link) => link.label)).toEqual(['Latest Updates', 'Professional Profile']);
	});
});
