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
		expect(caddyfile).toMatch(
			/handle @relay_preflight\s*{[^}]*Access-Control-Allow-Methods "POST, OPTIONS"[^}]*Access-Control-Allow-Headers "X-API-Key, X-API-Username, X-API-Timestamp, X-Request-ID, Content-Type, User-Agent, X-API-Intended-Origin"[^}]*Access-Control-Max-Age "86400"[^}]*respond 204[^}]*}/s,
		);
	});

	it('applies relay CORS response headers to preflight and proxied requests', () => {
		expect(caddyfile).toMatch(/@relay_cors\s*{[^}]*path \/relay\/\*[^}]*}/s);
		expect(caddyfile).toContain('header @relay_cors Access-Control-Allow-Origin "https://oullin.io"');
		expect(caddyfile).toContain('header @relay_cors Vary "Origin"');
	});

	it('proxies relay POSTs to the API Caddy mTLS endpoint through the shared alias', () => {
		expect(caddyfile).toMatch(/@relay_post\s*{[^}]*path \/relay\/\*[^}]*method POST[^}]*}/s);
		expect(caddyfile).toMatch(/handle @relay_post\s*{[^}]*uri strip_prefix \/relay[^}]*rewrite \* \/api{path}/s);
		expect(caddyfile).toContain('rewrite * /api{path}');
		expect(caddyfile).toContain('reverse_proxy https://proxy:8443');
		expect(caddyfile).toContain('tls_server_name oullin_proxy_prod');
	});

	it('rejects non-POST relay requests after preflight handling', () => {
		expect(caddyfile).toMatch(/handle \/relay\/\*\s*{\s*respond 405\s*}/s);
	});

	it('keeps the mTLS client certificate configuration pinned', () => {
		expect(caddyfile).toContain('tls_client_auth /etc/caddy/mtls/client.pem /etc/caddy/mtls/client.key');
		expect(caddyfile).toContain('tls_trust_pool file /etc/caddy/mtls/ca.pem');
	});

	it('keeps relay requests out of SPA HTML caching and fallback matchers', () => {
		const relayExclusions = caddyfile.match(/not path \/relay\/\*/g) ?? [];

		expect(relayExclusions.length).toBeGreaterThanOrEqual(2);
	});

	it('serves /.well-known (security.txt) as static files without SPA fallback', () => {
		expect(caddyfile).toMatch(/handle \/\.well-known\/\*\s*{[^}]*root \* \/usr\/share\/caddy[^}]*file_server[^}]*}/s);
	});
});
