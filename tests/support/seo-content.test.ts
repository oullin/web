import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { aboutPageContent } from '@/support/content/about-page.ts';
import { contactPageContent } from '@/support/content/contact-page.ts';
import { homePageContent } from '@/support/content/home-page.ts';
import { projectsPageContent } from '@/support/content/projects-page.ts';
import { siteContent } from '@/support/content.ts';
import { termsAndPoliciesPageContent } from '@/support/content/terms-and-policies-page.ts';
import { workWithUsPageContent } from '@/support/content/work-with-us-page.ts';
import { writingPageContent } from '@/support/content/writing-page.ts';

const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const staleGustavoTitle = 'Gustavo Ocanto - Engineering, Leadership, Fintech & eCommerce | Software Engineer, Architect, AI , AI Architect & Manager';

describe('SEO content fixtures', () => {
	it('keeps the home page and site defaults aligned to the current Oullin positioning', () => {
		expect(homePageContent.seo.title).toBe('Oullin');
		expect(homePageContent.seo.description).toBe(siteContent.seo.defaultDescription);
		expect(homePageContent.seo.keywords).toContain('AI architecture consulting');
		expect(siteContent.seo.defaultKeywords).toContain('AI Architecture Consultancy');
	});

	it('keeps page seo copy brand-led and removes stale person-led metadata', () => {
		expect(aboutPageContent.seo.description).not.toContain('Gustavo');
		expect(contactPageContent.seo.description).not.toContain('Gustavo');
		expect(JSON.stringify(aboutPageContent.seo.jsonLd)).not.toContain('"@type":"Person"');
		expect(JSON.stringify(contactPageContent.seo.jsonLd)).not.toContain('"@type":"Person"');
		expect(workWithUsPageContent.seo.description).toContain('judgment-first engagements');
		expect(projectsPageContent.seo.description).toContain('resilient software delivery');
		expect(writingPageContent.seo.description).toContain('engineering judgment');
		expect(termsAndPoliciesPageContent.seo.description).toContain("Oullin's terms and policies");
	});
});

describe('index.html seo defaults', () => {
	it('matches the current Oullin root metadata and excludes stale Gustavo branding', () => {
		expect(indexHtml).toContain('<html lang="en-GB"');
		expect(indexHtml).toContain('<title>Oullin</title>');
		expect(indexHtml).toContain(homePageContent.seo.description);
		expect(indexHtml).toContain('hreflang="en-GB"');
		expect(indexHtml).toContain('"logo": "https://oullin.io/brand/logo-touch.png"');
		expect(indexHtml).not.toContain(staleGustavoTitle);
	});
});
