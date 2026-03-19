<template>
	<div class="theme min-h-screen about-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">OULLIN // SOFTWARE ENGINEERING // SINGAPORE</p>
					<h1 class="page-title">Oullin.</h1>
					<div class="page-copy">
						<p>
							Oullin is a boutique software engineering and architecture consultancy for organisations navigating high-availability software, digital transformation in the AI era, and
							delivery in regulated or high-trust environments.
						</p>
						<p>&nbsp;</p>
						<p>
							The firm blends senior software engineering, consulting, software architecture, AI-first product and company experience, and technical management. The values still matter
							here, but they stay in service of systems that must work.
						</p>
					</div>
				</div>

				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">// founder</div>
						<div class="page-panel-title">Gustavo Ocanto</div>
						<p class="page-panel-copy">
							Founder of Oullin. Engineering leader with 20+ years across software, consulting, architecture, AI-first products and companies, and technical management.
						</p>
						<div class="mt-4">
							<a v-lazy-link href="https://www.linkedin.com/in/gocanto/" target="_blank" rel="noopener noreferrer" class="blog-link">LinkedIn Profile →</a>
						</div>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">// proof</div>
						<div class="data-list">
							<span>20+ years in software</span>
							<span>10+ years in banking</span>
							<span>High-availability systems</span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">What Oullin Brings</span>
						<h2 class="page-section-title">Engineering depth for complex transformation.</h2>
					</div>
					<p class="page-lead">
						Oullin helps teams modernise core software, shape architecture, and execute transformation in the AI era without losing rigour, reliability, or business context.
					</p>
				</div>

				<div class="page-editorial">
					<div class="page-editorial-row">
						<span class="page-section-label">The Firm</span>
						<p class="page-panel-copy">
							Oullin is a founder-led consultancy that works close to architecture and delivery. The focus is software that has to last: resilient platforms, modernisation programmes,
							AI-era change, and technical decision-making under pressure.
						</p>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">The Name</span>
						<p class="page-panel-copy">
							The name is a deliberate respelling of <strong>Ollin</strong>, the Aztec day-sign of movement and transformation. That idea remains, but here it supports a practical
							standard: keep moving, modernise with intent, and build software that survives contact with production.
						</p>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">How We Work</span>
						<p class="page-panel-copy">
							Clarity over hype. High standards over hollow velocity. Modernisation that respects constraints. Architecture decisions made to survive production, not just presentations.
						</p>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">Connect</span>
						<div>
							<p v-if="profile" key="connect" class="page-panel-copy">
								Reach out by <a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">email</a> if your team is modernising core systems, designing AI-era capabilities, or
								needs stronger architecture and technical leadership close to delivery.
							</p>
							<AboutConnectSkeletonPartial v-else-if="isLoadingProfile" key="skeleton" />
							<p v-else key="fallback" class="page-panel-copy">We are currently unable to load contact details. Please try again later.</p>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<RecommendationPartial class="!mt-0" />
				</div>
			</section>
		</main>

		<FooterPartial class="site-footer--about" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FooterPartial from '@partials/FooterPartial.vue';
import AboutConnectSkeletonPartial from '@partials/AboutConnectSkeletonPartial.vue';
import RecommendationPartial from '@partials/RecommendationPartial.vue';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, ORGANIZATION_JSON_LD } from '@support/seo';

import { useApiStore } from '@api/store.ts';
import type { ProfileResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const isLoadingProfile = ref(true);
const hasProfileError = ref(false);

useSeo({
	title: 'About',
	image: SEO_IMAGE,
	url: siteUrlFor('/about'),
	imageAlt: `${SITE_NAME} brand story`,
	keywords: buildKeywords(
		'about Oullin',
		'Gustavo Ocanto',
		'highly available software',
		'software architecture',
		'software engineering',
		'banking technology',
		'technical management',
		'digital transformation',
		'AI transformation',
		'regulated systems',
	),
	description: 'Meet Oullin and Gustavo Ocanto, and learn how the firm approaches highly available software, banking-domain systems, and digital transformation in the AI era.',
	jsonLd: [
		{
			name: 'About',
			'@type': 'AboutPage',
			url: siteUrlFor('/about'),
			'@context': 'https://schema.org',
			description: 'About Oullin, a boutique software engineering and architecture consultancy focused on resilient systems, modernisation, and AI-era transformation.',
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: 'Gustavo Ocanto',
			jobTitle: 'Founder of Oullin',
			url: siteUrlFor('/about'),
			description: 'Founder of Oullin and engineering leader working across architecture, modernisation, banking-domain systems, and software delivery.',
		},
		ORGANIZATION_JSON_LD,
	],
});

const loadAboutPageData = async () => {
	try {
		const res = await apiStore.getProfile();
		if (res.data) profile.value = res.data;
	} catch {
		hasProfileError.value = true;
	} finally {
		isLoadingProfile.value = false;
	}
};

onMounted(loadAboutPageData);
</script>
