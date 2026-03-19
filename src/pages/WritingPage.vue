<template>
	<div class="theme min-h-screen writing-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">{{ hero.kicker }}</p>
					<h1 class="page-title">{{ hero.title }}</h1>
					<div class="page-copy">
						<p>{{ hero.copy[0] }}</p>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.label }}</div>
						<div class="page-meta-list">
							<span v-for="item in sidebar.items" :key="item" v-html="item"></span>
						</div>
						<p class="page-panel-copy mt-4">{{ sidebar.copy }}</p>
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
import { writingPageContent, resolveJsonLd } from '@support/content.ts';

const { hero, sidebar, seo } = writingPageContent;

useSeo({
	title: seo.title,
	image: SEO_IMAGE,
	url: siteUrlFor('/writing'),
	imageAlt: seo.imageAlt ?? `${SITE_NAME} writing archive preview`,
	description: seo.description,
	keywords: buildKeywords(seo.keywords),
	jsonLd: [...(resolveJsonLd(seo.jsonLd, siteUrlFor) as Record<string, unknown>[]), ORGANIZATION_JSON_LD],
});
</script>
