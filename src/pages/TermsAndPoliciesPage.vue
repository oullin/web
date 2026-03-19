<template>
	<div class="theme min-h-screen">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">{{ hero.kicker }}</p>
					<h1 class="page-title">{{ hero.title }}</h1>
					<div class="page-copy">
						<p>{{ hero.copy[0] }}</p>
						<p>{{ hero.copy[1] }}</p>
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
					<section v-for="section in legalSections" :key="section.title" class="space-y-4">
						<h2 class="page-panel-title">{{ section.title }}</h2>
						<template v-if="section.contactLink">
							<p>
								For legal, billing, or policy-related enquiries, please contact us through the communication channels listed on the
								<RouterLink v-lazy-link :to="section.contactLink.to" class="blog-link">{{ section.contactLink.label }}</RouterLink
								>.
							</p>
						</template>
						<template v-else>
							<p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
						</template>
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
import { resolveJsonLd, termsAndPoliciesPageContent } from '@support/content.ts';

const { hero, sidebar, legalSections, seo } = termsAndPoliciesPageContent;

useSeo({
	title: seo.title,
	url: siteUrlFor('/terms-and-conditions'),
	description: seo.description,
	keywords: buildKeywords(seo.keywords),
	jsonLd: resolveJsonLd(seo.jsonLd, siteUrlFor),
});
</script>
