import site from '@fixtures/site.json';
import homePage from '@fixtures/home-page.json';
import aboutPage from '@fixtures/about-page.json';
import workWithUsPage from '@fixtures/work-with-us-page.json';
import contactPage from '@fixtures/contact-page.json';
import projectsPage from '@fixtures/projects-page.json';
import writingPage from '@fixtures/writing-page.json';
import termsAndPoliciesPage from '@fixtures/terms-and-policies-page.json';

type JsonLdEntry = Record<string, unknown>;
type JsonLdContent = JsonLdEntry | JsonLdEntry[];

export interface RouteLink {
	label: string;
	to: string;
}

export interface PageSeoContent {
	title?: string;
	description: string;
	keywords: string[];
	imageAlt?: string;
	jsonLd: JsonLdContent;
}

export interface SiteContent {
	name: string;
	twitterHandle: string;
	logoPath: string;
	seo: {
		defaultDescription: string;
		defaultKeywords: string[];
		siteLanguage: string;
		locale: string;
	};
	organization: {
		description: string;
		sameAs: string[];
	};
	nav: {
		links: RouteLink[];
	};
	footer: {
		brandLine: string;
		tagline: string;
		links: RouteLink[];
		backToTopLabel: string;
		marqueeItems: string[];
	};
	recommendations: {
		triggerLabel: string;
		intro: string;
		dialog: {
			sectionLabel: string;
			title: string;
			description: string;
		};
	};
	fallbackLinks: Array<{
		uuid: string;
		name: string;
		handle: string;
		url: string;
		description: string;
	}>;
}

export const siteContent = site as SiteContent;
export const homePageContent = homePage;
export const aboutPageContent = aboutPage;
export const workWithUsPageContent = workWithUsPage;
export const contactPageContent = contactPage;
export const projectsPageContent = projectsPage;
export const writingPageContent = writingPage;
export const termsAndPoliciesPageContent = termsAndPoliciesPage;

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
