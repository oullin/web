<template>
	<div class="theme min-h-screen">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">{{ hero.kicker }}</p>
					<h1 class="page-title">{{ hero.title }}</h1>
					<div class="page-copy">
						<p v-for="(paragraph, index) in hero.copy" :key="paragraph" :class="{ 'mt-6': index > 0 }">{{ paragraph }}</p>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.effectiveDate.label }}</div>
						<div class="page-panel-title">{{ sidebar.effectiveDate.title }}</div>
						<p class="page-panel-copy">{{ sidebar.effectiveDate.copy }}</p>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.scope.label }}</div>
						<div class="page-meta-list">
							<span v-for="item in sidebar.scope.items" :key="item" v-html="item"></span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-article">
				<div class="post-markdown prose dark:prose-invert space-y-10">
					<section v-for="section in legalSectionsWithLinkedParagraphs" :key="section.title" class="space-y-4">
						<h2 class="page-panel-title">{{ section.title }}</h2>
						<p v-for="paragraph in section.paragraphs" :key="paragraph.text">
							<template v-if="paragraph.contactLinkParts && section.contactLink">
								{{ paragraph.contactLinkParts.before }}
								<RouterLink v-lazy-link :to="section.contactLink.to" class="blog-link">{{ section.contactLink.label }}</RouterLink>
								{{ paragraph.contactLinkParts.after }}
							</template>
							<template v-else>{{ paragraph.text }}</template>
						</p>
					</section>
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import FooterPartial from '@partials/FooterPartial.vue';
import { useSeo, siteUrlFor, buildKeywords } from '@support/seo';
import { resolveJsonLd, type RouteLink } from '@support/content.ts';
import { termsAndPoliciesPageContent } from '@support/content/terms-and-policies-page.ts';

const { hero, sidebar, legalSections, seo } = termsAndPoliciesPageContent;
const splitContactLinkParagraph = (paragraph: string, contactLink?: RouteLink) => {
	if (!contactLink) {
		return null;
	}

	const labelIndex = paragraph.indexOf(contactLink.label);
	if (labelIndex === -1) {
		return null;
	}

	return {
		before: paragraph.slice(0, labelIndex),
		after: paragraph.slice(labelIndex + contactLink.label.length),
	};
};

const legalSectionsWithLinkedParagraphs = legalSections.map((section) => ({
	...section,
	paragraphs: section.paragraphs.map((paragraph) => ({
		text: paragraph,
		contactLinkParts: splitContactLinkParagraph(paragraph, section.contactLink),
	})),
}));

useSeo({
	title: seo.title,
	url: siteUrlFor('/terms-and-conditions'),
	description: seo.description,
	keywords: buildKeywords(seo.keywords),
	jsonLd: resolveJsonLd(seo.jsonLd, siteUrlFor),
});
</script>
