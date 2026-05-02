import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const caddyfile = readFileSync(resolve(process.cwd(), 'caddy/WebCaddyfile.internal'), 'utf8');

describe('production web Caddy relay contract', () => {
	it('keeps GET requests to the relay blocked', () => {
		expect(caddyfile).toMatch(/@relay_get\s*{[^}]*path \/relay\/\*[^}]*method GET[^}]*}/s);
		expect(caddyfile).toMatch(/handle @relay_get\s*{\s*respond 405\s*}/s);
	});

	it('answers relay preflight requests without proxying upstream', () => {
		expect(caddyfile).toMatch(/@relay_preflight\s*{[^}]*path \/relay\/\*[^}]*method OPTIONS[^}]*}/s);
		expect(caddyfile).toMatch(/handle @relay_preflight\s*{[^}]*Access-Control-Allow-Methods "POST, OPTIONS"[^}]*respond 204[^}]*}/s);
	});

	it('proxies relay POSTs to the API Caddy mTLS endpoint through the shared alias', () => {
		expect(caddyfile).toContain('handle_path /relay/*');
		expect(caddyfile).toContain('rewrite * /api{path}');
		expect(caddyfile).toContain('reverse_proxy https://proxy:8443');
		expect(caddyfile).toContain('tls_server_name oullin_proxy_prod');
	});

	it('keeps the mTLS client certificate configuration pinned', () => {
		expect(caddyfile).toContain('tls_client_auth /etc/caddy/mtls/client.pem /etc/caddy/mtls/client.key');
		expect(caddyfile).toContain('tls_trust_pool file /etc/caddy/mtls/ca.pem');
	});

	it('keeps relay requests out of SPA HTML caching and fallback matchers', () => {
		const relayExclusions = caddyfile.match(/not path \/relay\/\*/g) ?? [];

		expect(relayExclusions.length).toBeGreaterThanOrEqual(2);
	});
});
