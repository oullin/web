type JsonLdEntry = Record<string, unknown>;
export type JsonLdContent = JsonLdEntry | JsonLdEntry[];

// Repo-owned HTML snippets rendered with v-html. Never populate from user input or external data.
type TrustedHtml = string;

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

export interface HomePageContent {
	hero: {
		eyebrow: string;
		headline: Array<{
			text: string;
			accent?: boolean;
			accent2?: boolean;
		}>;
		sub: {
			lines: string[];
		};
		cta: Array<RouteLink & { style: string }>;
		dataBlocks: Array<
			| {
					type: 'metric';
					label: string;
					value: string;
					valueSuffix: string;
					bar: string;
					note: string[];
					valueColor?: string;
			  }
			| {
					type: 'list';
					label: string;
					items: string[];
			  }
			| {
					type: 'quote';
					label: string;
					lines: string[];
			  }
		>;
	};
	principles: {
		items: Array<{
			number: string;
			tag: string;
			title: string[];
			body: string;
		}>;
	};
	aiEra: {
		leftTag: string;
		titleLines: string[];
		body: string[];
		rightTag: string;
		work: Array<{
			index: string;
			title: string;
			description: string;
		}>;
		button: RouteLink;
	};
	about: {
		leftTag: string;
		defaultName: string[];
		body: {
			role: string;
			originIntro: string;
			origin: string;
			mission: string;
		};
		rightTag: string;
		work: Array<{
			index: string;
			title: string;
			description: string;
		}>;
	};
	cta: {
		watermark: string;
		headline: string[];
		headlineAccent: string;
		button: RouteLink;
	};
	seo: PageSeoContent;
}

export interface AboutPageContent {
	hero: {
		kicker: string;
		title: string;
		copy: string[];
	};
	sidebar: {
		founder: {
			label: string;
			name: string;
			copy: string;
			linkLabel: string;
			linkUrl: string;
		};
		proof: {
			label: string;
			items: string[];
		};
	};
	intro: {
		label: string;
		title: string;
		lead: string;
	};
	sections: Array<{
		label: string;
		paragraphs: string[];
	}>;
	connect: {
		label: string;
		copyBeforeLink: string;
		linkLabel: string;
		copyAfterLink: string;
	};
	seo: PageSeoContent;
}

export interface WorkWithUsPageContent {
	hero: {
		kicker: string;
		title: string;
		copy: string[];
	};
	sidebar: {
		engagements: {
			label: string;
			items: string[];
		};
		standard: {
			label: string;
			items: TrustedHtml[];
		};
	};
	intro: {
		label: string;
		title: string;
		lead: string;
	};
	engagements: Array<{
		label: string;
		values: string;
		summary: string;
		for: string;
		includesLabel: string;
		includes: string[];
		outcome: string;
		price: string;
		cta: RouteLink;
	}>;
	faq: {
		label: string;
		items: Array<{
			question: string;
			answer: string;
		}>;
	};
	cta: {
		label: string;
		copy: string;
		button: RouteLink;
	};
	seo: PageSeoContent;
}

export interface ContactPageContent {
	hero: {
		kicker: string;
		title: string;
		copy: string[];
	};
	sidebar: {
		primaryChannel: {
			label: string;
			fallbackTitle: string;
			copy: string;
			fallbackCopy: string;
		};
		bestFit: {
			label: string;
			items: TrustedHtml[];
		};
	};
	intro: {
		label: string;
		title: string;
		lead: string;
	};
	process: {
		label: string;
		items: string[];
	};
	email: {
		label: string;
		copyBeforeLink: string;
		copyAfterLink: string;
	};
	social: {
		label: string;
		unavailableCopy: string;
	};
	founder: {
		label: string;
		copy: string;
	};
	seo: PageSeoContent;
}

export interface ProjectsPageContent {
	hero: {
		kicker: string;
		title: string;
		copy: string[];
	};
	sidebar: {
		statsLabel: string;
		focus: {
			label: string;
			items: TrustedHtml[];
		};
	};
	intro: {
		label: string;
		title: string;
	};
	seo: PageSeoContent;
}

export interface WritingPageContent {
	hero: {
		kicker: string;
		title: string;
		copy: string[];
	};
	sidebar: {
		label: string;
		items: TrustedHtml[];
		copy: string;
	};
	seo: PageSeoContent;
}

export interface TermsAndPoliciesPageContent {
	hero: {
		kicker: string;
		title: string;
		copy: string[];
	};
	sidebar: {
		effectiveDate: {
			label: string;
			title: string;
			copy: string;
		};
		scope: {
			label: string;
			items: TrustedHtml[];
		};
	};
	legalSections: Array<{
		title: string;
		paragraphs: string[];
		contactLink?: RouteLink;
	}>;
	seo: PageSeoContent;
}
