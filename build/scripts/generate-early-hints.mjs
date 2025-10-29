#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const args = new Map();
for (let i = 0; i < argv.length; i += 1) {
	const key = argv[i];
	if (!key.startsWith('--')) {
		continue;
	}
	const value = argv[i + 1]?.startsWith('--') || argv[i + 1] === undefined ? undefined : argv[i + 1];
	args.set(key, value);
	if (value !== undefined) {
		i += 1;
	}
}

const htmlPath = path.resolve(process.cwd(), args.get('--html') ?? 'dist/index.html');
const snippetPath = path.resolve(process.cwd(), args.get('--snippet') ?? 'caddy/snippets/early_hints.caddy');

const beginMarker = '# BEGIN EARLY HINTS';
const endMarker = '# END EARLY HINTS';

const normalizePath = (href) => {
	if (!href) {
		return undefined;
	}

	if (/^(?:https?:)?\/\//i.test(href) || href.startsWith('data:') || href.startsWith('about:')) {
		return undefined;
	}

	const cleaned = href.replace(/^[.\/]+/, '').replace(/\/+/g, '/');
	return `/${cleaned}`;
};

const parseAttributes = (tag) => {
	const attrs = new Map();
	const attrString = tag.replace(/^<[^\s>]+/i, '').replace(/\/?\s*>$/, '');
	const attrRegex = /([a-zA-Z_:][-\w.:]*)\s*(=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
	let match;
	while ((match = attrRegex.exec(attrString)) !== null) {
		const name = match[1].toLowerCase();
		const rawValue = match[3] ?? '';
		const value = rawValue.replace(/^['"]|['"]$/g, '');
		attrs.set(name, value);
	}
	return attrs;
};

const resources = new Map();

const addResource = ({ href, rel, as, crossorigin, type }) => {
	const normalized = normalizePath(href);
	if (!normalized) {
		return;
	}

	const keyParts = [normalized, rel ?? '', as ?? '', crossorigin ?? '', type ?? ''];
	const key = keyParts.join('|');
	if (!resources.has(key)) {
		resources.set(key, { href: normalized, rel, as, crossorigin, type });
	}
};

const html = await readFile(htmlPath, 'utf8');

for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
	const attrs = parseAttributes(match[0]);
	const rel = attrs.get('rel');
	if (!rel) {
		continue;
	}

	const relTokens = rel.split(/\s+/);
	const href = attrs.get('href');
	const as = attrs.get('as');
	const crossorigin = attrs.has('crossorigin') ? attrs.get('crossorigin') || 'anonymous' : undefined;
	const type = attrs.get('type');

	if (relTokens.includes('modulepreload')) {
		addResource({ href, rel: 'modulepreload', as: 'script', crossorigin });
	} else if (relTokens.includes('stylesheet')) {
		addResource({ href, rel: 'preload', as: 'style', crossorigin });
	} else if (relTokens.includes('preload')) {
		addResource({ href, rel: 'preload', as, crossorigin, type });
	}
}

for (const match of html.matchAll(/<script\b[^>]*>/gi)) {
	const attrs = parseAttributes(match[0]);
	const type = attrs.get('type');
	const src = attrs.get('src');
	if (type === 'module' && src) {
		const crossorigin = attrs.has('crossorigin') ? attrs.get('crossorigin') || 'anonymous' : undefined;
		addResource({ href: src, rel: 'modulepreload', as: 'script', crossorigin });
	}
}

const lines = [];
for (const { href, rel, as, crossorigin, type } of resources.values()) {
	if (!rel) {
		continue;
	}
	const parts = [`<${href}>`, `rel=${rel}`];
	if (as) {
		parts.push(`as=${as}`);
	}
	if (type) {
		const escapedType = type.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
		parts.push(`type='${escapedType}'`);
	}
	if (crossorigin) {
		if (crossorigin === 'use-credentials') {
			parts.push('crossorigin=use-credentials');
		} else {
			parts.push('crossorigin');
		}
	}
	lines.push(`early_hint @oullin_early_hints Link "${parts.join('; ')}"`);
}

lines.sort((a, b) => a.localeCompare(b));

const snippet = await readFile(snippetPath, 'utf8');
const startIndex = snippet.indexOf(beginMarker);
const endIndex = snippet.indexOf(endMarker);
if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
	throw new Error(`Unable to find early hints markers in ${snippetPath}`);
}

const before = snippet.slice(0, startIndex + beginMarker.length);
const after = snippet.slice(endIndex);

let replacement;
if (lines.length > 0) {
	const content = lines.map((line) => `        ${line}`).join('\n');
	replacement = `\n${content}`;
} else {
	replacement = '\n        # No eligible assets discovered for Early Hints';
}

const updated = `${before}${replacement}\n${after}`;
await writeFile(snippetPath, updated, 'utf8');

if (args.has('--verbose')) {
	if (lines.length > 0) {
		console.info(`Generated ${lines.length} early_hint directive(s).`);
	} else {
		console.info('No assets discovered for Early Hints.');
	}
}
