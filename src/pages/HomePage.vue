<template>
	<div class="theme min-h-screen home-wrap">
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
					<template v-for="(line, i) in nameLines" :key="i">{{ line }}<br v-if="i < nameLines.length - 1" /></template>
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

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import HeroPartial from '@/partials/HeroPartial.vue';
import NavPartial from '@/partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { ProfileResponse } from '@api/response/index.ts';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';
import marquee from '@fixtures/marquee.json';
import principles from '@fixtures/principles.json';
import about from '@fixtures/about.json';
import cta from '@fixtures/cta.json';

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const marqueeItems = marquee.items;

const nameLines = computed<string[]>(() => {
	if (!profile.value?.name) {
		return about.defaultName;
	}

	return profile.value.name.toUpperCase().split(' ');
});

useSeo({
	title: 'Oullin',
	image: SEO_IMAGE,
	url: siteUrlFor('/'),
	imageAlt: `${SITE_NAME} and Oullin brand preview`,
	keywords: buildKeywords(
		'Oullin',
		'movement and transformation',
		'engineering leadership',
		'AI architecture',
		'software architect/engineering',
		'technical management',
		'digital transformation',
		'AI orchestration',
	),
	description: `Oullin is ${SITE_NAME}'s platform for engineering leadership, AI architecture, open source systems, and writing built around movement, transformation, and signal.`,
	jsonLd: [
		{
			name: 'Oullin',
			'@type': 'WebPage',
			url: siteUrlFor('/'),
			'@context': 'https://schema.org',
			description: `Landing page for Oullin, where ${SITE_NAME} shares engineering leadership, AI architecture, open source work, and writing.`,
		},
		PERSON_JSON_LD,
	],
});

onMounted(async () => {
	try {
		const userProfileResponse = await apiStore.getProfile();

		if (userProfileResponse.data) {
			profile.value = userProfileResponse.data;
		}
	} catch (error) {
		debugError(error);
	}
});
</script>
