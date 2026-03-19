<template>
	<div class="theme min-h-screen writing-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">WRITING // ESSAYS // SIGNAL</p>
					<h1 class="page-title">Writing archive.</h1>
					<div class="page-copy">
						<p>This page holds Oullin's article archive. It is a dedicated place to browse categories, open essays, and follow the writing without burying it inside the landing page.</p>
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
				<ArticlesListPartial />
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import FooterPartial from '@partials/FooterPartial.vue';
import ArticlesListPartial from '@partials/ArticlesListPartial.vue';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, ORGANIZATION_JSON_LD } from '@support/seo';

useSeo({
	title: 'Writing',
	image: SEO_IMAGE,
	url: siteUrlFor('/writing'),
	imageAlt: `${SITE_NAME} writing archive preview`,
	description: `Browse ${SITE_NAME}'s writing archive for technical essays, architecture notes, and category-based reading across software, AI, and systems thinking.`,
	keywords: buildKeywords(
		'writing archive',
		'technical essays',
		'architecture notes',
		'systems thinking',
		'software architect/engineering',
		'technical management',
		'digital transformation',
		'AI orchestration',
	),
	jsonLd: [
		{
			name: 'Writing Archive',
			'@type': 'CollectionPage',
			url: siteUrlFor('/writing'),
			'@context': 'https://schema.org',
			description: `${SITE_NAME}'s archive of essays, notes, and articles on software engineering, AI, and architecture.`,
		},
		ORGANIZATION_JSON_LD,
	],
});
</script>
