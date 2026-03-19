<template>
	<div class="theme min-h-screen work-with-us-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">{{ hero.kicker }}</p>
					<h1 class="page-title">{{ hero.title }}</h1>
					<div class="page-copy">
						<p>{{ hero.copy[0] }}</p>
						<p>&nbsp;</p>
						<p>{{ hero.copy[1] }}</p>
					</div>
				</div>
				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.engagements.label }}</div>
						<div class="page-meta-list">
							<span v-for="item in sidebar.engagements.items" :key="item">{{ item }}</span>
						</div>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.standard.label }}</div>
						<div class="page-meta-list">
							<span v-for="item in sidebar.standard.items" :key="item" v-html="item"></span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">{{ intro.label }}</span>
						<h2 class="page-section-title">{{ intro.title }}</h2>
					</div>
					<p class="page-lead">{{ intro.lead }}</p>
				</div>

				<div class="page-editorial">
					<template v-for="engagement in engagements" :key="engagement.label">
						<div class="page-editorial-row">
							<div>
								<h3 class="page-section-label">{{ engagement.label }}</h3>
								<p class="page-panel-copy">
									<em>{{ engagement.values }}</em>
								</p>
							</div>
							<div>
								<p class="page-panel-copy">{{ engagement.summary }}</p>
								<p class="page-panel-copy mt-3"><strong>For:</strong> {{ engagement.for }}</p>
								<div class="page-section-label mt-5">{{ engagement.includesLabel }}</div>
								<div class="page-meta-list">
									<span v-for="item in engagement.includes" :key="item">{{ item }}</span>
								</div>
								<p class="page-panel-copy mt-5"><strong>You leave with:</strong> {{ engagement.outcome }}</p>
								<p class="page-panel-copy mt-2">{{ engagement.price }}</p>
								<RouterLink :to="engagement.cta.to" class="btn-primary mt-5 inline-block">{{ engagement.cta.label }}</RouterLink>
							</div>
						</div>
						<div class="page-editorial-sep"></div>
					</template>

					<div class="page-editorial-row">
						<h3 class="page-section-label">{{ faq.label }}</h3>
						<div>
							<template v-for="(item, index) in faq.items" :key="item.question">
								<div class="page-panel-copy">
									<h4 class="page-panel-heading">{{ item.question }}</h4>
									<p>{{ item.answer }}</p>
								</div>
								<div v-if="index < faq.items.length - 1" class="page-editorial-sep mt-5 mb-5"></div>
							</template>
						</div>
					</div>
					<div class="page-editorial-sep"></div>

					<div class="page-editorial-row">
						<h3 class="page-section-label">{{ cta.label }}</h3>
						<div>
							<p class="page-panel-copy">{{ cta.copy }}</p>
							<RouterLink :to="cta.button.to" class="btn-primary mt-5 inline-block">{{ cta.button.label }}</RouterLink>
						</div>
					</div>
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import FooterPartial from '@partials/FooterPartial.vue';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, ORGANIZATION_JSON_LD } from '@support/seo';
import { workWithUsPageContent, resolveJsonLd } from '@support/content.ts';

const { hero, sidebar, intro, engagements, faq, cta, seo } = workWithUsPageContent;

useSeo({
	title: seo.title,
	image: SEO_IMAGE,
	url: siteUrlFor('/work-with-us'),
	imageAlt: seo.imageAlt ?? `${SITE_NAME} engagements`,
	keywords: buildKeywords(seo.keywords),
	description: seo.description,
	jsonLd: [...(resolveJsonLd(seo.jsonLd, siteUrlFor) as Record<string, unknown>[]), ORGANIZATION_JSON_LD],
});
</script>
