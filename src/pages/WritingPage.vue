<template>
	<div class="theme min-h-screen writing-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">WRITING // USE CASES // FIELD NOTES</p>
					<h1 class="page-title">Field notes from real systems.</h1>
					<div class="page-copy">
						<p>
							Patterns, decisions, and hard-won lessons from 20+ years of building software that has to keep working. Architecture, AI integration, fintech, and the problems that show up
							when prototypes meet production.
						</p>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">[ // WHAT THIS IS FOR ]</div>
						<div class="page-meta-list">
							<span><strong>Scope:</strong> use cases, case studies, technical essays</span>
							<span><strong>Filter:</strong> category-first browsing</span>
							<span><strong>Intent:</strong> concrete over abstract — problems, decisions, outcomes</span>
						</div>
						<p class="page-panel-copy mt-4">
							These aren't opinion pieces. They're documentation of real architectural decisions, integration patterns, and the failure modes that only show up under real load.
							Engineering judgment, written down so you can use it.
						</p>
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
	description: `Field notes from real systems. Use cases, case studies, and technical essays on AI architecture, production systems, and engineering judgment — problems, decisions, and outcomes from 20+ years of building software that has to keep working.`,
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
