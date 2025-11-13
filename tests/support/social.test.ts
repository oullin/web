import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Social } from '@/support/social.ts';
import type { SocialResponse } from '@api/response';

const { getSocialMock, debugErrorMock } = vi.hoisted(() => ({
	getSocialMock: vi.fn(),
	debugErrorMock: vi.fn(),
}));

vi.mock('@api/store.ts', () => ({
	useApiStore: () => ({
		getSocial: getSocialMock,
	}),
}));

vi.mock('@api/http-error.ts', async () => {
	const actual = await vi.importActual<typeof import('@api/http-error.ts')>('@api/http-error.ts');
	return {
		...actual,
		debugError: debugErrorMock,
	};
});

const sampleSocialResponse: SocialResponse[] = [
	{ uuid: '1', name: 'x', handle: '@user', url: 'https://x.com/user', description: 'micro posts' },
	{ uuid: '2', name: 'github', handle: 'user', url: 'https://github.com/user', description: 'repos' },
];

describe('Social.fetch', () => {
	beforeEach(() => {
		getSocialMock.mockReset();
		debugErrorMock.mockReset();
	});

	it('returns API data when available', async () => {
		getSocialMock.mockResolvedValueOnce({ data: sampleSocialResponse });

		const social = new Social();
		const result = await social.fetch();

		expect(getSocialMock).toHaveBeenCalledTimes(1);
		expect(result).toEqual(sampleSocialResponse);
	});

	it('falls back to an empty list when the response lacks data', async () => {
		getSocialMock.mockResolvedValueOnce({ data: undefined });

		const social = new Social();
		const result = await social.fetch();

		expect(result).toEqual([]);
		expect(debugErrorMock).not.toHaveBeenCalled();
	});

	it('logs errors and returns an empty list when the request fails', async () => {
		const error = new Error('network failed');
		getSocialMock.mockRejectedValueOnce(error);

		const social = new Social();
		const result = await social.fetch();

		expect(result).toEqual([]);
		expect(debugErrorMock).toHaveBeenCalledWith(error);
	});
});

describe('Social.buildNavLinks', () => {
	it('ignores unknown platforms and uses provided allowlist', () => {
		const socialEntries: SocialResponse[] = [
			{ uuid: '1', name: 'x', handle: '@user', url: 'https://x.com/user', description: 'micro posts' },
			{ uuid: '2', name: 'github', handle: 'user', url: 'https://github.com/user', description: 'repos' },
			{ uuid: '3', name: 'facebook', handle: 'user', url: 'https://fb.com/user', description: 'legacy' },
		];

		const social = new Social();
		const links = social.buildNavLinks(socialEntries, ['github']);

		expect(links).toHaveLength(1);
		expect(links[0]).toMatchObject({
			href: 'https://github.com/user',
			label: 'Code & Projects',
		});
		expect(links[0].icon).toBeTruthy();
	});

	it('defaults to all configured platforms when allowlist is omitted', () => {
		const socialEntries: SocialResponse[] = [
			{ uuid: '1', name: 'x', handle: '@user', url: 'https://x.com/user', description: 'micro posts' },
			{ uuid: '2', name: 'linkedin', handle: 'user', url: 'https://linkedin.com/in/user', description: 'work' },
		];

		const social = new Social();
		const links = social.buildNavLinks(socialEntries);

		expect(links.map((link) => link.label)).toEqual(['Latest Updates', 'Professional Profile']);
	});
});
