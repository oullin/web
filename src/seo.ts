/**
 * SEO utilities for managing meta tags across the application.
 * Provides coverage for major browsers and social networks and
 * exposes JSON-LD injection to aid AI and other crawlers.
 */

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

function setMetaByName(name: string, content?: string): void {
        if (!content) return;
        let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
        if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
        }
        element.setAttribute('content', content);
}

function setMetaByProperty(property: string, content?: string): void {
        if (!content) return;
        let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
        if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
        }
        element.setAttribute('content', content);
}

function setLink(rel: string, href?: string): void {
        if (!href) return;
        let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
        if (!element) {
                element = document.createElement('link');
                element.setAttribute('rel', rel);
                document.head.appendChild(element);
        }
        element.setAttribute('href', href);
}

function setJsonLd(data?: Record<string, unknown>): void {
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

/**
 * Apply SEO metadata.
 * @param options configuration for meta tags
 */
export function applySeo(options: SeoOptions): void {
        const url = options.url ?? window.location.href;
        const image = options.image
                ? new URL(options.image, window.location.origin).toString()
                : undefined;
        const title = options.title ?? document.title;
        const description = options.description;

        document.title = title;

        // Generic meta
        setMetaByName('description', description);
        setMetaByName('keywords', options.keywords);
        setMetaByName('robots', options.robots ?? 'index,follow');
        setMetaByName('theme-color', options.themeColor ?? '#ffffff');
        setMetaByName('msapplication-TileColor', options.themeColor ?? '#ffffff');
        setMetaByName('application-name', title);
        setMetaByName('apple-mobile-web-app-title', title);

        setLink('canonical', url);

        // Open Graph
        setMetaByProperty('og:title', title);
        setMetaByProperty('og:description', description);
        setMetaByProperty('og:type', options.type ?? 'website');
        setMetaByProperty('og:url', url);
        setMetaByProperty('og:image', image);
        setMetaByProperty('og:site_name', options.siteName ?? title);

        // Twitter
        const twitter = options.twitter ?? {};
        setMetaByName('twitter:card', twitter.card ?? 'summary_large_image');
        setMetaByName('twitter:site', twitter.site);
        setMetaByName('twitter:creator', twitter.creator);
        setMetaByName('twitter:title', title);
        setMetaByName('twitter:description', description);
        setMetaByName('twitter:image', image);

        // Structured data for AI and crawlers
        setJsonLd(options.jsonLd);
}
