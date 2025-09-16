import type { PostResponse } from '@api/response/posts-response.ts';

export const DEFAULT_SITE_URL = 'https://oullin.io'
export const SITE_NAME = 'Gustavo Ocanto';
export const SITE_URL =
	(import.meta.env?.VITE_SITE_URL as string | undefined) ??
	(typeof window !== 'undefined' ? window.location.origin : DEFAULT_SITE_URL);


type TwitterCard = 'summary' | 'summary_large_image' | 'app' | 'player';

interface SeoOptions {
	title?: string;
	description?: string;
	keywords?: string;
	image?: string;
	url?: string;
	siteName?: string;
	type?: string;
	themeColor?: string;
	robots?:
		| string
		| {
		index?: boolean;       // default true
		follow?: boolean;      // default true
		archive?: boolean;     // default true
		imageindex?: boolean;  // default true
		nocache?: boolean;     // default false
		noai?: boolean;
	};
	twitter?: {
		card?: TwitterCard;
		site?: string;    // e.g. @gocanto
		creator?: string; // e.g. @gocanto
	};
	jsonLd?: Record<string, unknown>;
}

export class Seo {
	apply(options: SeoOptions): void {
		const currentPath = window.location.pathname + window.location.search;
		const url = options.url ?? new URL(currentPath, SITE_URL).toString();
		const image = options.image ? new URL(options.image, SITE_URL).toString() : undefined;
		const title = options.title ? `${options.title} - ${SITE_NAME}` : SITE_NAME;
		const description = options.description;

		document.title = title;

		// Generic meta
		this.setMetaByName('description', description);
		this.setMetaByName('keywords', options.keywords);
		this.setMetaByName('robots', this.buildRobots(options.robots));
		this.setMetaByName('theme-color', options.themeColor ?? '#ffffff');
		this.setMetaByName('msapplication-TileColor', options.themeColor ?? '#ffffff');
		this.setMetaByName('application-name', title);
		this.setMetaByName('apple-mobile-web-app-title', title);

		this.setLink('canonical', url);

		// Open Graph
		this.setMetaByProperty('og:title', title);
		this.setMetaByProperty('og:description', description);
		this.setMetaByProperty('og:type', options.type ?? 'website');
		this.setMetaByProperty('og:url', url);
		this.setMetaByProperty('og:image', image);
		this.setMetaByProperty('og:site_name', options.siteName ?? SITE_NAME);

		// Twitter
		const twitter = options.twitter ?? {};
		this.setMetaByName('twitter:card', twitter.card ?? 'summary_large_image');
		this.setMetaByName('twitter:site', twitter.site);
		this.setMetaByName('twitter:creator', twitter.creator);
		this.setMetaByName('twitter:title', title);
		this.setMetaByName('twitter:description', description);
		this.setMetaByName('twitter:image', image);

		// Structured data for AI and crawlers
		this.setJsonLd(options.jsonLd);
	}

	applyFromPost(post: PostResponse): void {
		this.apply({
			title: `${SITE_NAME} | ${post.title}`,
			description: post.excerpt,
			image: post.cover_image_url,
			type: 'article',
			url: new URL(`/posts/${post.slug}`, SITE_URL).toString(),
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: post.title,
				description: post.excerpt,
				image: post.cover_image_url,
				datePublished: post.published_at,
				author: {
					'@type': 'Person',
					name: SITE_NAME,
				},
			},
		});
	}

	private setMetaByName(name: string, content?: string): void {
		if (!content) return;

		let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('name', name);

			document.head.appendChild(element);
		}

		element.setAttribute('content', content);
	}

	private setMetaByProperty(property: string, content?: string): void {
		if (!content) return;
		let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
		if (!element) {
			element = document.createElement('meta');
			element.setAttribute('property', property);
			document.head.appendChild(element);
		}
		element.setAttribute('content', content);
	}

	private setLink(rel: string, href?: string): void {
		if (!href) return;
		let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
		if (!element) {
			element = document.createElement('link');
			element.setAttribute('rel', rel);
			document.head.appendChild(element);
		}
		element.setAttribute('href', href);
	}

	private setJsonLd(data?: Record<string, unknown>): void {
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

	private buildRobots(robots?: SeoOptions['robots']): string | undefined {
		if (!robots) return 'index,follow';
		if (typeof robots === 'string') return robots;

		const {
			index = true,
			follow = true,
			archive = true,
			imageindex = true,
			nocache = false,
			noai = false,
		} = robots;

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
