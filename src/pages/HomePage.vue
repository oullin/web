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
				<div class="section-tag">{{ aiEra.leftTag }}</div>
				<h2 class="about-name">
					<template v-for="(line, index) in aiEra.titleLines" :key="line">{{ line }}<br v-if="index < aiEra.titleLines.length - 1" /></template>
				</h2>
				<p class="about-body">
					<template v-for="(paragraph, index) in aiEra.body" :key="paragraph">
						<template v-if="index > 0"><br /><br /></template>
						{{ paragraph }}
					</template>
				</p>
			</div>
			<div class="about-right">
				<div class="section-tag">{{ aiEra.rightTag }}</div>
				<div class="work-list">
					<div v-for="item in aiEra.work" :key="item.index" class="work-item">
						<span class="w-idx">{{ item.index }}</span>
						<div>
							<div class="w-title">{{ item.title }}</div>
							<div class="w-desc">{{ item.description }}</div>
						</div>
					</div>
				</div>
				<div>&nbsp;</div>
				<RouterLink :to="aiEra.button.to" class="btn-ghost mt-8 inline-block">{{ aiEra.button.label }}</RouterLink>
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
					{{ about.body.originIntro }} {{ about.body.origin }}
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
import HeroPartial from '@partials/Hero.vue';
import FooterPartial from '@partials/Footer.vue';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, ORGANIZATION_JSON_LD, WEBSITE_JSON_LD } from '@support/seo';
import { resolveJsonLdArray } from '@support/json-ld.ts';
import { homePageContent } from '@support/content/home-page.ts';

const { principles, aiEra, about, cta, seo } = homePageContent;
const nameLines = about.defaultName;

useSeo({
	title: seo.title,
	image: SEO_IMAGE,
	url: siteUrlFor('/'),
	imageAlt: seo.imageAlt ?? `${SITE_NAME} brand preview`,
	keywords: buildKeywords(seo.keywords),
	description: seo.description,
	jsonLd: [...resolveJsonLdArray(seo.jsonLd, siteUrlFor), WEBSITE_JSON_LD, ORGANIZATION_JSON_LD],
});
</script>
