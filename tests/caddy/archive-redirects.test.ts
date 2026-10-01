import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import canonicalRedirects from '../fixtures/writing-archive-redirects.json';

const caddyfile = readFileSync(resolve(process.cwd(), 'caddy/WebCaddyfile.internal'), 'utf8');
const redirects = [...caddyfile.matchAll(/^\s*redir (\/post\/\S+) (\S+) (\d+)$/gm)];

// These targets match the existing API Caddy archive migration, including its slug corrections.
describe('production legacy writing redirects', () => {
	it.each(Object.entries(canonicalRedirects))('redirects %s to its canonical archive target for humans', (path, target) => {
		const rule = redirects.find((match) => match[1] === path);
		expect(rule?.[2]).toBe(target);
		expect(rule?.[3]).toBe('301');
		expect(rule?.index).toBeLessThan(caddyfile.indexOf('@force_seo'));
		expect(rule?.index).toBeLessThan(caddyfile.indexOf('@share_post_bots'));
	});

	it('only redirects mapped posts and keeps the SPA fallback for other routes', () => {
		expect(redirects.map((match) => match[1]).toSorted()).toEqual(Object.keys(canonicalRedirects).toSorted());
		expect(caddyfile).not.toMatch(/redir \/post\/\*/);
		expect(caddyfile).toMatch(/handle\s*{\s*root \* \/usr\/share\/caddy\s*try_files \{path\} \{path\}\/index\.html \/index\.html/s);
	});
});
