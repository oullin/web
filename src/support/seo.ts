import { computed, onBeforeUnmount, unref, watchEffect, type MaybeRefOrGetter } from 'vue';
import type { PostResponse } from '@api/response/posts-response.ts';
import { siteContent } from '@support/content.ts';

export const SITE_NAME = siteContent.name;
const DEFAULT_SITE_URL = 'https://oullin.io';
export const SEO_IMAGE = '/images/profile/about-seo.png';
export const SITE_LOGO = siteContent.logoPath;
export const DEFAULT_TWITTER_HANDLE = siteContent.twitterHandle;
export const DEFAULT_DESCRIPTION = siteContent.seo.defaultDescription;
export const SITE_URL = (import.meta.env?.VITE_SITE_URL as string | undefined) ?? (typeof window !== 'undefined' ? window.location.origin : DEFAULT_SITE_URL);
export const DEFAULT_KEYWORDS = siteContent.seo.defaultKeywords.join(',');
export const WEBSITE_JSON_LD = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: SITE_NAME,
	url: SITE_URL,
	description: DEFAULT_DESCRIPTION,
};
export const ORGANIZATION_JSON_LD = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: SITE_NAME,
	url: SITE_URL,
	logo: siteUrlFor(SITE_LOGO),
	image: siteUrlFor(SITE_LOGO),
	description: siteContent.organization.description,
	sameAs: siteContent.organization.sameAs,
};

type TwitterCard = 'summary' | 'summary_large_image' | 'app' | 'player';
type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

interface SeoOptions {
	title?: string;
	description?: string;
	keywords?: string | string[];
	image?: string;
	imageAlt?: string;
	url?: string;
	siteName?: string;
	type?: string;
	themeColor?: string;
	locale?: string;
	siteLanguage?: string;
	robots?:
		| string
		| {
				index?: boolean; // default true
				follow?: boolean; // default true
				archive?: boolean; // default true
				imageindex?: boolean; // default true
				nocache?: boolean; // default false
				noai?: boolean;
		  };
	twitter?: {
		card?: TwitterCard;
		site?: string; // e.g. @oullin
		creator?: string; // e.g. @oullin
	};
	jsonLd?: JsonLd;
}

const hasDocument = typeof document !== 'undefined';
const hasWindow = typeof window !== 'undefined';

export class Seo {
	apply(options: SeoOptions): void {
		if (!hasDocument || !hasWindow) return;

		const currentPath = window.location.pathname + window.location.search;
		const url = options.url ?? siteUrlFor(currentPath || '/');
		const image = new URL(options.image ?? SEO_IMAGE, SITE_URL).toString();
		const title = options.title ? `${options.title} - ${SITE_NAME}` : SITE_NAME;
		const description = options.description ?? DEFAULT_DESCRIPTION;
		const language = options.siteLanguage ?? siteContent.seo.siteLanguage;
		const locale = options.locale ?? siteContent.seo.locale;
		const keywords = normalizeKeywords(options.keywords) ?? DEFAULT_KEYWORDS;

		document.title = title;

		if (language) {
			document.documentElement.setAttribute('lang', language);
		}

		// Generic meta
		this.setMetaByName('description', description);
		this.setMetaByName('keywords', keywords);
		this.setMetaByName('robots', this.buildRobots(options.robots));
		this.setMetaByName('theme-color', options.themeColor ?? '#ffffff');
		this.setMetaByName('msapplication-TileColor', options.themeColor ?? '#ffffff');
		this.setMetaByName('application-name', title);
		this.setMetaByName('apple-mobile-web-app-title', title);
		this.setMetaByName('author', SITE_NAME);
		this.setMetaByName('language', language);

		this.setLink('canonical', url);
		this.setAlternateHrefLang(url, language);
		this.setAlternateHrefLang(url, 'x-default');

		// Open Graph
		this.setMetaByProperty('og:title', title);
		this.setMetaByProperty('og:description', description);
		this.setMetaByProperty('og:type', options.type ?? 'website');
		this.setMetaByProperty('og:url', url);
		this.setMetaByProperty('og:image', image);
		this.setMetaByProperty('og:image:alt', options.imageAlt ?? title);
		this.setMetaByProperty('og:site_name', options.siteName ?? SITE_NAME);
		this.setMetaByProperty('og:locale', locale);

		// Twitter
		const twitter = options.twitter ?? {};
		this.setMetaByName('twitter:card', twitter.card ?? 'summary_large_image');
		this.setMetaByName('twitter:site', twitter.site ?? DEFAULT_TWITTER_HANDLE);
		this.setMetaByName('twitter:creator', twitter.creator ?? DEFAULT_TWITTER_HANDLE);
		this.setMetaByName('twitter:title', title);
		this.setMetaByName('twitter:description', description);
		this.setMetaByName('twitter:image', image);
		this.setMetaByName('twitter:image:alt', options.imageAlt ?? title);

		// Structured data for AI and crawlers
		this.setJsonLd(options.jsonLd);
	}

	private setMetaByName(name: string, content?: string): void {
		if (!hasDocument) return;

		const selector = `meta[name="${name}"]`;
		let element = document.head.querySelector<HTMLMetaElement>(`${selector}[data-seo="1"]`) ?? document.head.querySelector<HTMLMetaElement>(selector);

		if (!content) {
			if (element?.dataset.seo === '1') element.remove();
			return;
		}

		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('name', name);
			document.head.appendChild(element);
		}

		element.dataset.seo = '1';
		element.setAttribute('content', content);
	}

	private setMetaByProperty(property: string, content?: string): void {
		if (!hasDocument) return;
		const selector = `meta[property="${property}"]`;
		let element = document.head.querySelector<HTMLMetaElement>(`${selector}[data-seo="1"]`) ?? document.head.querySelector<HTMLMetaElement>(selector);

		if (!content) {
			if (element?.dataset.seo === '1') element.remove();
			return;
		}

		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('property', property);
			document.head.appendChild(element);
		}

		element.dataset.seo = '1';
		element.setAttribute('content', content);
	}

	private setLink(rel: string, href?: string): void {
		if (!hasDocument) return;
		if (!href) return;
		let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
		if (!element) {
			element = document.createElement('link');
			element.setAttribute('rel', rel);
			document.head.appendChild(element);
		}
		element.setAttribute('href', href);
	}

	private setJsonLd(data?: JsonLd): void {
		if (!hasDocument) return;
		const id = 'seo-jsonld';
		let script = document.getElementById(id) as HTMLScriptElement | null;
		if (!data) {
			if (script) script.remove();
			return;
		}
		const json = JSON.stringify(data);
		if (!script) {
			script = document.createElement('script');
			script.type = 'application/ld+json';
			script.id = id;
			document.head.appendChild(script);
		}
		script.textContent = json;
	}

	private setAlternateHrefLang(href: string, hreflang?: string): void {
		if (!hasDocument) return;
		if (!href || !hreflang) return;

		let element = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);

		if (!element) {
			element = document.createElement('link');
			element.setAttribute('rel', 'alternate');
			element.setAttribute('hreflang', hreflang);
			document.head.appendChild(element);
		}

		element.setAttribute('href', href);
	}

	private buildRobots(robots?: SeoOptions['robots']): string | undefined {
		if (!robots) return 'index,follow';
		if (typeof robots === 'string') return robots;

		const { index = true, follow = true, archive = true, imageindex = true, nocache = false, noai = false } = robots;

		const tokens: string[] = [];
		tokens.push(index ? 'index' : 'noindex');
		tokens.push(follow ? 'follow' : 'nofollow');

		if (!archive) tokens.push('noarchive');
		if (!imageindex) tokens.push('noimageindex');
		if (nocache) tokens.push('nocache');
		if (noai) tokens.push('noai', 'noimageai');

		return tokens.join(',');
	}
}

export const seo = new Seo();

function normalizeKeywords(keywords?: string | string[]): string | undefined {
	if (!keywords) {
		return undefined;
	}

	const list = Array.isArray(keywords)
		? keywords
		: keywords
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item.length > 0);

	const unique = Array.from(new Set(list.map((item) => item.trim()).filter((item) => item.length > 0)));

	if (!unique.length) {
		return undefined;
	}

	return unique.join(',');
}

function resolveValue<T>(value: MaybeRefOrGetter<T>): T {
	return typeof value === 'function' ? (value as () => T)() : unref(value);
}

export function useSeo(options: MaybeRefOrGetter<SeoOptions | null | undefined>): void {
	if (!hasDocument || !hasWindow) return;

	const stop = watchEffect(() => {
		const resolved = resolveValue(options);

		if (!resolved) return;

		seo.apply(resolved);
	});

	onBeforeUnmount(() => {
		stop();
	});
}

export function useSeoFromPost(post: MaybeRefOrGetter<PostResponse | null | undefined>): void {
	const seoOptions = computed<SeoOptions | undefined>(() => {
		const value = resolveValue(post);

		if (!value) return undefined;

		const keywords = buildKeywords(
			value.categories.map((category) => category.name),
			value.tags.map((tag) => tag.name),
			'article',
		);

		return {
			title: value.title,
			description: value.excerpt,
			image: value.cover_image_url,
			imageAlt: `${value.title} cover image`,
			keywords,
			type: 'article',
			url: siteUrlFor(`/post/${value.slug}`),
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: value.title,
				description: value.excerpt,
				image: value.cover_image_url,
				mainEntityOfPage: siteUrlFor(`/post/${value.slug}`),
				datePublished: value.published_at,
				dateModified: value.updated_at,
				keywords,
				articleSection: value.categories.map((category) => category.name),
				author: {
					'@type': 'Person',
					name: value.author.display_name || SITE_NAME,
				},
				publisher: {
					'@type': 'Organization',
					name: SITE_NAME,
					url: SITE_URL,
					logo: siteUrlFor(SITE_LOGO),
				},
			},
		} satisfies SeoOptions;
	});

	useSeo(seoOptions);
}

export function siteUrlFor(path: string): string {
	return new URL(path, SITE_URL).toString();
}

export function buildKeywords(...entries: Array<string | string[] | null | undefined>): string {
	const baseKeywords = DEFAULT_KEYWORDS.split(',')
		.map((keyword) => keyword.trim())
		.filter(Boolean);
	const uniqueKeywords = new Set(baseKeywords);

	entries.forEach((entry) => {
		if (!entry) {
			return;
		}

		const tokens = Array.isArray(entry)
			? entry
			: entry
					.split(',')
					.map((token) => token.trim())
					.filter((token) => token.length > 0);

		tokens.forEach((token) => {
			if (token.length > 0) {
				uniqueKeywords.add(token);
			}
		});
	});

	return Array.from(uniqueKeywords).join(',');
}
