import type { JsonLdContent } from '@support/content-types.ts';

type JsonLdEntry = Record<string, unknown>;

function isJsonLdEntry(value: unknown): value is JsonLdEntry {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveJsonLdEntry(entry: JsonLdEntry, resolveUrl: (path: string) => string): JsonLdEntry {
	const resolved = Object.entries(entry).reduce<JsonLdEntry>((acc, [key, value]) => {
		if (key === 'urlPath' && typeof value === 'string') {
			acc.url = resolveUrl(value);
			return acc;
		}

		if (Array.isArray(value)) {
			acc[key] = value.map((item) => (isJsonLdEntry(item) ? resolveJsonLdEntry(item, resolveUrl) : item));
			return acc;
		}

		if (isJsonLdEntry(value)) {
			acc[key] = resolveJsonLdEntry(value, resolveUrl);
			return acc;
		}

		acc[key] = value;
		return acc;
	}, {});

	return resolved;
}

export function resolveJsonLd(jsonLd: JsonLdContent, resolveUrl: (path: string) => string): JsonLdContent {
	if (Array.isArray(jsonLd)) {
		return jsonLd.map((entry) => resolveJsonLdEntry(entry, resolveUrl));
	}

	return resolveJsonLdEntry(jsonLd, resolveUrl);
}

export function resolveJsonLdArray(jsonLd: JsonLdContent, resolveUrl: (path: string) => string): JsonLdEntry[] {
	const resolvedJsonLd = resolveJsonLd(jsonLd, resolveUrl);
	return Array.isArray(resolvedJsonLd) ? resolvedJsonLd : [resolvedJsonLd];
}
