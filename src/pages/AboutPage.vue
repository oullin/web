<template>
	<div class="theme min-h-screen about-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">ABOUT // OULLIN // MOVEMENT // CRAFT</p>
					<h1 class="page-title">Oullin.</h1>
					<div class="page-copy">
						<p>
							Oullin is a boutique software engineering and architecture consultancy focused on resilient systems, AI-era modernisation, and delivery in regulated and high-trust
							environments.
						</p>
						<p>&nbsp;</p>
						<p>
							We work close to architecture and delivery. Not above it. The focus is software that has to last — resilient platforms, modernisation programmes, AI-era change, and
							technical decision-making under pressure.
						</p>
					</div>
				</div>

				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">// founder &amp; lead architect</div>
						<div class="page-panel-title">Gustavo Ocanto</div>
						<p class="page-panel-copy">
							Engineering leader with 20+ years across software engineering, consulting, architecture, AI-first products and companies, and technical management. 10+ years in banking and
							fintech.
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
						<span class="page-section-label">The Firm</span>
						<h2 class="page-section-title">Small by design. Senior by default.</h2>
					</div>
					<p class="page-lead">
						Oullin is deliberately small. We take a limited number of engagements at a time so every client gets the senior architectural attention their systems require. We don't scale
						headcount to fill projects. We scale judgment.
					</p>
				</div>

				<div class="page-editorial">
					<div class="page-editorial-row">
						<span class="page-section-label">The Firm</span>
						<div>
							<p class="page-panel-copy">
								Oullin is a boutique software engineering and architecture consultancy focused on resilient systems, AI-era modernisation, and delivery in regulated and high-trust
								environments. We work close to architecture and delivery. Not above it.
							</p>
							<p class="page-panel-copy mt-3">
								The focus is software that has to last — resilient platforms, modernisation programmes, AI-era change, and technical decision-making under pressure.
							</p>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">The Name</span>
						<p class="page-panel-copy">
							Oullin is a deliberate misspelling of <strong>Ollin</strong> — the Aztec sacred day-sign of movement and transformation. The name still points to movement. But here,
							movement is carried by engineering depth and a practical standard: keep moving, modernise with intent, and build software that survives contact with production. Movement is
							not optional. Neither is rigour.
						</p>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">How We Work</span>
						<div>
							<p class="page-panel-copy">
								Clarity over hype. High standards over hollow velocity. Modernisation that respects constraints. Architecture decisions made to survive production, not just
								presentations.
							</p>
							<p class="page-panel-copy mt-3">
								We only recommend AI where it is the right answer. We don't dress up good engineering in buzzwords. We don't take engagements we can't deliver with senior attention.
								And we don't produce roadmaps that disappear into a drawer.
							</p>
							<p class="page-panel-copy mt-3">The work is the standard. Movement is not optional.</p>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">// founder's note</span>
						<div>
							<p class="page-panel-copy">
								I started Oullin because I kept seeing the same pattern: companies adopting AI at the feature layer without anyone asking what happens to that code in six months, at
								ten times the load, in a regulated market.
							</p>
							<p class="page-panel-copy mt-3">
								I've been building production systems for over 20 years. I've been the Head of Engineering. I've been the founding engineer. I've been the person called at 3 AM when
								production goes down. I know what breaks and why.
							</p>
							<p class="page-panel-copy mt-3">
								The name Oullin comes from Ollin — movement and transformation. But I chose it because I believe movement without rigour is just chaos with momentum. The work has
								always been about systems that hold. The AI era made that work more urgent, not different.
							</p>
							<p class="page-panel-copy mt-3">If your team is moving fast and needs someone to make sure the architecture holds the pace — that's the conversation I want to have.</p>
							<p class="page-panel-copy mt-3">— Gustavo Ocanto, Founder &amp; Lead Architect</p>
						</div>
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
	description: 'A boutique software engineering and architecture consultancy. Movement and craft in service of systems that hold. Led by Gustavo Ocanto.',
	jsonLd: [
		{
			name: 'About',
			'@type': 'AboutPage',
			url: siteUrlFor('/about'),
			'@context': 'https://schema.org',
			description:
				'About Oullin, a boutique software engineering and architecture consultancy focused on resilient systems, AI-era modernisation, and delivery in regulated and high-trust environments.',
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
