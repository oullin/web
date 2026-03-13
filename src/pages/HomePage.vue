<template>
	<div class="theme min-h-screen">
		<!-- NAV -->
		<NavPartial />

		<!-- HERO -->
		<HeroPartial />

		<!-- MARQUEE -->
		<div class="marquee-wrap">
			<div class="marquee-track">
				<span v-for="item in marqueeItems" :key="item" class="marquee-item">{{ item }} <em>///</em></span>
				<!-- duplicate for seamless loop -->
				<span v-for="item in marqueeItems" :key="`dup-${item}`" class="marquee-item" aria-hidden="true">{{ item }} <em>///</em></span>
			</div>
		</div>

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
					<template v-for="(line, i) in about.name" :key="i">{{ line }}<br v-if="i < about.name.length - 1" /></template>
				</h2>
				<p class="about-body">
					{{ about.body.role }}<br /><br />
					The name <strong>Oullin</strong> is a deliberate misspelling of <strong>Ollin</strong> — the Aztec sacred day-sign of movement, transformation. {{ about.body.origin }}<br /><br />
					{{ about.body.mission }}
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
		<section id="projects" class="cta-section">
			<div class="cta-watermark">{{ cta.watermark }}</div>
			<h2 class="cta-head">
				<template v-for="(line, i) in cta.headline" :key="i">{{ line }}<br /></template>
				<span class="accent">{{ cta.headlineAccent }}</span>
			</h2>
			<RouterLink :to="cta.button.to" class="btn-primary">{{ cta.button.label }}</RouterLink>
		</section>

		<footer class="site-footer">
			<span>OULLIN // GUSTAVO OCANTO</span>
			<span>MOVEMENT // TRANSFORMATION // HEART // LIFE</span>
			<span>© 2026 · <RouterLink :to="TERMS_AND_POLICIES_PATH" class="hover:text-white transition-colors">Terms</RouterLink></span>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import HeroPartial from '@/partials/HeroPartial.vue';
import NavPartial from '@/partials/NavPartial.vue';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';
import { TERMS_AND_POLICIES_PATH } from '@/support/routes';
import marquee from '@fixtures/marquee.json';
import principles from '@fixtures/principles.json';
import about from '@fixtures/about.json';
import cta from '@fixtures/cta.json';

const marqueeItems = marquee.items;

useSeo({
	title: 'Home',
	image: ABOUT_IMAGE,
	url: siteUrlFor('/'),
	imageAlt: `${SITE_NAME} profile portrait`,
	keywords: buildKeywords('software engineering leadership', 'technology articles', 'engineering management insights'),
	description: `${SITE_NAME} is a full-stack Software Engineer leader & architect with over two decades of experience in building complex web systems and products.`,
	jsonLd: [
		{
			name: 'Home',
			'@type': 'WebPage',
			url: siteUrlFor('/'),
			'@context': 'https://schema.org',
			description: `${SITE_NAME} shares articles about software engineering, leadership, AI, and architecture.`,
		},
		PERSON_JSON_LD,
	],
});
</script>
