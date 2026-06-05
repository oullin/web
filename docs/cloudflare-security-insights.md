# Cloudflare Security Insights — Remediation Runbook

Source: `Cloudflare_Ollin_SecurityInsights_20260604_1635.csv` (oullin.io, scanned 2026-05).
All three findings were **Low** severity.

## Architecture note

`oullin.io` is fronted by the **API repo's** Caddy (`~/Sites/oullin/api/infra/caddy/Caddyfile.prod`),
which is the public TLS edge. It routes `/api/*` and `/relay/*` to the Go API and proxies
**everything else to `web:80`** (the web container's Caddy, this repo). So static files like
`/.well-known/security.txt` and `/robots.txt` are served by the **web** container — no API change
is required.

## 1. Security.txt not configured — FIXED IN CODE (this repo)

- `public/.well-known/security.txt` (RFC 9116) is served by the web Caddy via the new
  `handle /.well-known/*` block in `caddy/WebCaddyfile.internal` (and `.local`).
- **Maintenance:** the `Expires:` field is set to `2027-06-05`. Refresh it before that date or the
  file becomes non-compliant.

## 2. AI Labyrinth (review unwanted AI crawlers) — DASHBOARD ACTION (not code)

- Cloudflare dashboard → **Security → Bots** → enable **AI Labyrinth**.
- Dashboard toggle only. The new `public/robots.txt` (Disallow: `/seo`) complements it but does not
  replace it.

## 3. DMARC Record Error — DNS ACTION (not code)

The 5 duplicate findings are per-MX flags of the same missing policy; **one** TXT record resolves
all of them. The API sends no email, so this is purely DNS/mail-infra.

Cloudflare dashboard → **DNS** → add:

```txt
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=none; rua=mailto:gustavoocanto@gmail.com; fo=1
```

- Start with `p=none` (monitor only). DMARC only _passes_ if SPF and/or DKIM are configured for the
  sending mail provider — confirm those exist first.
- After reviewing `rua` aggregate reports for clean alignment, tighten to `p=quarantine`, then
  `p=reject`.

## Verification

- `curl -sI https://oullin.io/.well-known/security.txt` → `200`, `Content-Type: text/plain`.
- `curl -s https://oullin.io/robots.txt` → robots body (not the SPA `index.html`).
- DMARC: `dig +short TXT _dmarc.oullin.io` → returns the policy once added.
- Re-run / await the next Cloudflare Security Insights scan to confirm each finding clears.
