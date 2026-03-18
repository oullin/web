<template>
	<div class="theme min-h-screen home-wrap">
		<!-- NAV -->
		<NavPartial />

		<!-- HERO -->
		<HeroPartial />

		<!-- PRINCIPLES -->
		<section id="principles" class="principles">
			<div v-for="principle in principles.items" :key="principle.number" class="principle">
				<div class="p-num">[ {{ principle.number }} / {{ principle.tag }} ]</div>
				<h2 class="p-title">
					<template v-for="(line, i) in principle.title" :key="i">{{ line }}<br v-if="i < principle.title.length - 1" /></template>
				</h2>
				<p class="p-body">{{ principle.body }}</p>
				<div class="p-ghost">{{ principle.number }}</div>
			</div>
		</section>

		<!-- ABOUT -->
		<section id="about" class="about-section">
			<div class="about-left">
				<div class="section-tag">{{ about.leftTag }}</div>
				<h2 class="about-name">
					<template v-for="(line, i) in nameLines" :key="i">{{ line }}<br v-if="i < nameLines.length - 1" /></template>
				</h2>
				<p class="about-body">
					{{ about.body.role }}<br /><br />
					{{ about.body.mission }}<br /><br />
					The name <strong>Oullin</strong> is a deliberate misspelling of <strong>Ollin</strong>, the Aztec sacred day-sign of movement and transformation. {{ about.body.origin }}
				</p>
			</div>
			<div class="about-right">
				<div class="section-tag">{{ about.rightTag }}</div>
				<div class="work-list">
					<div v-for="item in about.work" :key="item.index" class="work-item">
						<span class="w-idx">{{ item.index }}</span>
						<div>
							<div class="w-title">{{ item.title }}</div>
							<div class="w-desc">{{ item.description }}</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section id="contact" class="cta-section" style="border-top: 0">
			<div class="cta-watermark">{{ cta.watermark }}</div>
			<h2 class="cta-head">
				<template v-for="(line, i) in cta.headline" :key="i">{{ line }}<br /></template>
				<span class="accent">{{ cta.headlineAccent }}</span>
			</h2>
			<RouterLink :to="cta.button.to" class="btn-primary">{{ cta.button.label }}</RouterLink>
		</section>

		<FooterPartial :show-marquee="true" />
	</div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import HeroPartial from '@partials/HeroPartial.vue';
import NavPartial from '@partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, ORGANIZATION_JSON_LD, WEBSITE_JSON_LD } from '@support/seo';
import principles from '@fixtures/principles.json';
import about from '@fixtures/about.json';
import cta from '@fixtures/cta.json';

const nameLines = about.defaultName;

useSeo({
	image: SEO_IMAGE,
	url: siteUrlFor('/'),
	imageAlt: `${SITE_NAME} brand preview`,
	keywords: buildKeywords('highly available software', 'software architecture', 'technical management', 'digital transformation', 'AI transformation', 'banking technology', 'consulting'),
	description:
		'Oullin is a boutique software engineering and architecture consultancy with 20+ years across software, consulting, architecture, AI-first products and companies, and technical management, including 10+ years in banking.',
	jsonLd: [
		{
			name: SITE_NAME,
			'@type': 'WebPage',
			url: siteUrlFor('/'),
			'@context': 'https://schema.org',
			description: 'Landing page for Oullin, covering highly available software, banking-domain delivery, architecture leadership, and digital transformation in the AI era.',
		},
		WEBSITE_JSON_LD,
		ORGANIZATION_JSON_LD,
	],
});
</script>
