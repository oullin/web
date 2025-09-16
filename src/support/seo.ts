import { useHead } from '@unhead/vue';
import { computed, unref, type MaybeRefOrGetter } from 'vue';
import type { PostResponse } from '@api/response/posts-response.ts';

// --- Constants ---
export const SITE_NAME = 'Gustavo Ocanto';
export const DEFAULT_SITE_URL = 'https://oullin.io';
export const ABOUT_IMAGE = '/images/profile/about.jpg';
export const SITE_URL = (import.meta.env?.VITE_SITE_URL as string | undefined) ?? DEFAULT_SITE_URL;

// --- TypeScript Interface ---
interface SeoOptions {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: string;
	jsonLd?: Record<string, unknown>;
	// You can add back other options like 'keywords' if needed
}

// --- Helper Functions ---
function resolveValue<T>(value: MaybeRefOrGetter<T>): T {
	return typeof value === 'function' ? (value as () => T)() : unref(value);
}

export function siteUrlFor(path: string): string {
	// A small fix to prevent errors on the server where 'window' doesn't exist.
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
	return new URL(path, baseUrl).toString();
}

// --- Main Composables ---
export function useSeo(options: MaybeRefOrGetter<SeoOptions | null | undefined>): void {
	const optionsRef = computed(() => {
		const resolved = resolveValue(options);
		if (!resolved) return {};
		return resolved;
	});

	useHead(
		computed(() => {
			// Prepare data with fallbacks and formatting
			const title = optionsRef.value.title ? `${optionsRef.value.title} - ${SITE_NAME}` : SITE_NAME;
			const description = optionsRef.value.description;
			const image = optionsRef.value.image ? siteUrlFor(optionsRef.value.image) : undefined;
			const url = optionsRef.value.url ?? siteUrlFor('/');

			// Build the object for useHead
			return {
				title,
				link: [{ rel: 'canonical', href: url }],
				meta: [
					{ name: 'description', content: description },
					// Open Graph
					{ property: 'og:title', content: title },
					{ property: 'og:description', content: description },
					{ property: 'og:url', content: url },
					{ property: 'og:image', content: image },
					{ property: 'og:type', content: optionsRef.value.type ?? 'website' },
					// Twitter
					{ name: 'twitter:card', content: 'summary_large_image' },
					{ name: 'twitter:title', content: title },
					{ name: 'twitter:description', content: description },
					{ name: 'twitter:image', content: image },
				],
				script: optionsRef.value.jsonLd
					? [
							{
								id: 'seo-jsonld',
								type: 'application/ld+json',
								innerHTML: JSON.stringify(optionsRef.value.jsonLd),
							},
						]
					: [],
			};
		}),
	);
}

export function useSeoFromPost(post: MaybeRefOrGetter<PostResponse | null | undefined>): void {
	const seoOptions = computed<SeoOptions | undefined>(() => {
		const value = resolveValue(post);
		if (!value) return undefined;

		return {
			title: value.title,
			description: value.excerpt,
			image: value.cover_image_url,
			type: 'article',
			url: siteUrlFor(`/post/${value.slug}`),
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: value.title,
				description: value.excerpt,
				image: value.cover_image_url,
				datePublished: value.published_at,
				author: {
					'@type': 'Person',
					name: SITE_NAME,
				},
			},
		};
	});

	useSeo(seoOptions);
}
