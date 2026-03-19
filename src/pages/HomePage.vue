<template>
	<div class="theme min-h-screen home-wrap">
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

		<!-- AI ERA -->
		<section id="ai-era" class="about-section">
			<div class="about-left">
				<div class="section-tag">// ai.era</div>
				<h2 class="about-name">The bottleneck shifted.<br />We were ready.</h2>
				<p class="about-body">
					AI tools generate code faster than most teams can review it. The cost of implementation is falling. The cost of a bad architectural decision is not.<br /><br />
					Oullin has always been in the business of engineering judgment — knowing what to build, how to build it safely, and what breaks under real load in a regulated environment. The AI
					era didn't change our work. It made it more necessary.<br /><br />
					We work with startups and scale-ups as a fractional AI architecture partner. Not to generate code. To ensure what gets generated holds.
				</p>
			</div>
			<div class="about-right">
				<div class="section-tag">// engagements</div>
				<div class="work-list">
					<div class="work-item">
						<span class="w-idx">[ 01 ]</span>
						<div>
							<div class="w-title">AI Architecture Sprint</div>
							<div class="w-desc">Two weeks. One production-ready roadmap. Built by engineers who have shipped the systems you're building.</div>
						</div>
					</div>
					<div class="work-item">
						<span class="w-idx">[ 02 ]</span>
						<div>
							<div class="w-title">Fractional AI Architect</div>
							<div class="w-desc">Embedded. Reviewing what your team and your AI tools produce. 3-month minimum.</div>
						</div>
					</div>
					<div class="work-item">
						<span class="w-idx">[ 03 ]</span>
						<div>
							<div class="w-title">Production Hardening</div>
							<div class="w-desc">Your prototype works in demos. We make it work in production.</div>
						</div>
					</div>
				</div>
				<div>&nbsp;</div>
				<RouterLink to="/work-with-us" class="btn-ghost mt-8 inline-block">See all engagements →</RouterLink>
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
	keywords: buildKeywords(
		'AI architecture consulting',
		'fractional AI architect',
		'AI-era modernisation',
		'software architecture',
		'technical management',
		'banking technology',
		'fintech',
		'startup AI architecture',
	),
	description:
		'Oullin is a boutique AI architecture consultancy for startups and scale-ups. 20+ years of production systems experience — banking, fintech, high-availability infrastructure — applied to the AI era.',
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
