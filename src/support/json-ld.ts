import type { JsonLdContent } from '@support/contype.ts';

type JsonLdEntry = Record<string, unknown>;

function isJsonLdEntry(value: unknown): value is JsonLdEntry {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mapEntry(entry: JsonLdEntry, resolveUrl: (path: string) => string): JsonLdEntry {
	return Object.entries(entry).reduce<JsonLdEntry>((acc, [key, value]) => {
		if (key === 'urlPath' && typeof value === 'string') {
			acc.url = resolveUrl(value);

			return acc;
		}

		if (Array.isArray(value)) {
			acc[key] = value.map((item) => (isJsonLdEntry(item) ? mapEntry(item, resolveUrl) : item));

			return acc;
		}

		if (isJsonLdEntry(value)) {
			acc[key] = mapEntry(value, resolveUrl);

			return acc;
		}

		acc[key] = value;

		return acc;
	}, {});
}

export function resolveJsonLd(jsonLd: JsonLdContent, resolveUrl: (path: string) => string): JsonLdContent {
	if (Array.isArray(jsonLd)) {
		return jsonLd.map((entry) => mapEntry(entry, resolveUrl));
	}

	return mapEntry(jsonLd, resolveUrl);
}

export function resolveJsonLdArray(jsonLd: JsonLdContent, resolveUrl: (path: string) => string): JsonLdEntry[] {
	const jsonLdVal = resolveJsonLd(jsonLd, resolveUrl);

	return Array.isArray(jsonLdVal) ? jsonLdVal : [jsonLdVal];
}
