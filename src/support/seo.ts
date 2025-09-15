/**
 * SEO manager for managing meta tags across the application.
 * Provides coverage for major browsers and social networks and
 * exposes JSON-LD injection to aid AI and other crawlers.
 */

export const SITE_NAME = 'Gustavo Ocanto';

export interface SeoOptions {
	title?: string;
	description?: string;
	keywords?: string;
	image?: string;
	url?: string;
	siteName?: string;
	type?: string;
	themeColor?: string;
	robots?: string;
	twitter?: {
		card?: string;
		site?: string;
		creator?: string;
	};
	jsonLd?: Record<string, unknown>;
}

export class Seo {
	apply(options: SeoOptions): void {
		const url = options.url ?? window.location.href;
		const image = options.image ? new URL(options.image, window.location.origin).toString() : undefined;
		const title = options.title ? `${options.title} - ${SITE_NAME}` : SITE_NAME;
		const description = options.description;

		document.title = title;

		// Generic meta
		this.setMetaByName('description', description);
		this.setMetaByName('keywords', options.keywords);
		this.setMetaByName('robots', options.robots ?? 'index,follow');
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
}

export const seo = new Seo();

export default seo;
