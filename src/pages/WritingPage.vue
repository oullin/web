<template>
	<div class="theme min-h-screen">
		<NavPartial />

		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">WRITING // ESSAYS // SIGNAL</p>
					<h1 class="page-title">Writing archive.</h1>
					<div class="page-copy">
						<p>
							This page holds the article feed that used to be implied on the homepage. It is now a dedicated place to browse categories, open essays, and follow the writing without
							burying it inside the landing page.
						</p>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">What this page is for</div>
						<div class="page-meta-list">
							<span><strong>Scope:</strong> articles, notes, technical essays</span>
							<span><strong>Filter:</strong> category-first browsing</span>
							<span><strong>Intent:</strong> keep the homepage focused and the archive useful</span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-panel">
					<ArticlesListPartial />
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import NavPartial from '@partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import ArticlesListPartial from '@partials/ArticlesListPartial.vue';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';

useSeo({
	title: 'Writing',
	image: ABOUT_IMAGE,
	url: siteUrlFor('/writing'),
	imageAlt: `${SITE_NAME} writing archive`,
	description: `Browse the writing archive of ${SITE_NAME}, including technical essays, architecture notes, and category-based article navigation.`,
	keywords: buildKeywords('writing archive', 'technical articles', 'software engineering essays'),
	jsonLd: [
		{
			name: 'Writing',
			'@type': 'CollectionPage',
			url: siteUrlFor('/writing'),
			'@context': 'https://schema.org',
			description: `${SITE_NAME} writing archive and article collection.`,
		},
		PERSON_JSON_LD,
	],
});
</script>
