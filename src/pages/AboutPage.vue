<template>
	<div class="theme min-h-screen">
		<NavPartial />

		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">OULLIN // BRAND // SINGAPORE</p>
					<h1 class="page-title">Oullin.</h1>
					<div class="page-copy">
						<p>
							Oullin is a platform built on a single conviction: <strong>movement matters</strong>. The name is a deliberate misspelling of <strong>Ollin</strong> — the Aztec sacred
							day-sign of movement and transformation. A daily reminder that stillness is a choice, and rarely the right one.
						</p>
						<p>
							We build tools, write ideas, and ship systems that move people forward. Engineering leadership. AI architecture. Open source. All of it grounded in presence, craft, and the
							belief that what you build should outlast the hype cycle.
						</p>
					</div>
				</div>

				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">// founder</div>
						<div class="page-panel-title">Gustavo Ocanto</div>
						<p class="page-panel-copy">Engineering leader. AI architect. Co-founder of Oullin. 20+ years building systems that hold up under real operating pressure.</p>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">// mission</div>
						<div class="data-list">
							<span>Movement</span>
							<span>Transformation</span>
							<span>Signal</span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">What We Stand For</span>
						<h2 class="page-section-title">Build with intention. Ship with confidence. Move with purpose.</h2>
					</div>
					<p class="page-lead">
						Oullin is not a product — it is a practice. A way of working that treats software as a craft, leadership as a responsibility, and transformation as the only constant worth
						designing around.
					</p>
				</div>

				<div class="page-editorial">
					<div class="page-editorial-row">
						<span class="page-section-label">The Name</span>
						<p class="page-panel-copy">
							Ollin is the 17th day-sign of the Aztec calendar — the symbol of movement and earthquake, of things that shake and shift the world. Oullin is that energy, deliberately
							respelled, brought into the present.
						</p>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">The Platform</span>
						<p class="page-panel-copy">
							Engineering leadership, AI architecture, and open source tools — built in the open and returned to the community with the same energy they were taken from.
						</p>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">The Philosophy</span>
						<p class="page-panel-copy">Every line of code is a choice. Every decision, deliberate. Build like it matters — because it does. Complexity is allowed. Confusion is not.</p>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">Co-Founder</span>
						<div>
							<p class="page-panel-copy">
								<strong>Gustavo Ocanto</strong> — Full-stack software engineer and engineering leader with over two decades of experience building complex web systems, AI-powered
								platforms, and high-trust client products across banking, insurance, and SaaS. Works across Go, Node.js, TypeScript, and PHP, with practical depth in Laravel, Vue,
								Symfony, and Next.js.
							</p>
							<p class="page-panel-copy mt-4">Leads with precision, calm thinking, and a bias for strong fundamentals over short-lived momentum.</p>
							<div class="mt-4">
								<a v-if="linkedinUrl !== '#'" v-lazy-link :href="linkedinUrl" target="_blank" rel="noopener noreferrer" class="blog-link">View LinkedIn Profile →</a>
								<p v-else-if="profile" class="page-panel-copy">Reach out by <a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">email</a> to connect directly.</p>
							</div>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">Connect</span>
						<div>
							<p v-if="profile" key="connect" class="page-panel-copy">
								Reach out by <a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">email</a> to discuss projects, architecture, or ideas. If there is an interesting system
								to design or improve, the conversation is open.
							</p>
							<AboutConnectSkeletonPartial v-else-if="isLoadingProfile" key="skeleton" />
							<p v-else key="fallback" class="page-panel-copy">We are currently unable to load contact details. Please try again later.</p>
						</div>
					</div>
				</div>
			</section>

			<section v-if="profile && profile.skills.length > 0" class="skills-band">
				<div class="marquee-track">
					<span v-for="skill in profile.skills" :key="skill.uuid" class="marquee-item">{{ skill.item }} <em aria-hidden="true">///</em></span>
					<span v-for="skill in profile.skills" :key="`dup-${skill.uuid}`" class="marquee-item" aria-hidden="true">{{ skill.item }} <em>///</em></span>
				</div>
			</section>

			<section v-if="recommendations.length > 0" class="page-band !pt-10">
				<RecommendationPartial :recommendations="recommendations" />
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import NavPartial from '@partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import AboutConnectSkeletonPartial from '@partials/AboutConnectSkeletonPartial.vue';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';

import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { ProfileResponse, RecommendationsResponse, SocialResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const recommendations = ref<RecommendationsResponse[]>([]);
const socialLinks = ref<SocialResponse[]>([]);
const isLoadingProfile = ref(true);

const linkedinUrl = computed<string>(() => {
	return socialLinks.value.find((s) => s.name.toLowerCase() === 'linkedin')?.url ?? '#';
});

useSeo({
	title: 'About Oullin',
	image: SEO_IMAGE,
	url: siteUrlFor('/about'),
	imageAlt: `${SITE_NAME} and Oullin brand story`,
	keywords: buildKeywords(
		'about Oullin',
		'Gustavo Ocanto',
		'movement and transformation',
		'engineering leadership',
		'software architect/engineering',
		'technical management',
		'digital transformation',
		'AI orchestration',
		'open source philosophy',
	),
	description: `Learn why Oullin is built around movement and transformation, and meet ${SITE_NAME}, the co-founder and engineering leader behind the platform.`,
	jsonLd: [
		{
			name: 'About Oullin',
			'@type': 'AboutPage',
			url: siteUrlFor('/about'),
			'@context': 'https://schema.org',
			description: `About Oullin, its movement-first philosophy, and ${SITE_NAME}'s work across engineering leadership, AI architecture, and open source.`,
		},
		PERSON_JSON_LD,
	],
});

const loadAboutPageData = () => {
	apiStore
		.getProfile()
		.then((res) => {
			if (res.data) profile.value = res.data;
		})
		.catch(debugError)
		.finally(() => (isLoadingProfile.value = false));

	apiStore
		.getSocial()
		.then((res) => {
			if (res.data) socialLinks.value = res.data;
		})
		.catch(debugError);

	apiStore
		.getRecommendations()
		.then((res) => {
			if (res.data) recommendations.value = res.data;
		})
		.catch(debugError);
};

onMounted(loadAboutPageData);
</script>
