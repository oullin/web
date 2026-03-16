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

				<div class="page-panel-grid">
					<article class="page-panel">
						<h3 class="page-panel-title">The Name</h3>
						<p class="page-panel-copy">
							Ollin is the 17th day-sign of the Aztec calendar — the symbol of movement and earthquake, of things that shake and shift the world. Oullin is that energy, deliberately
							respelled, brought into the present.
						</p>
					</article>
					<article class="page-panel">
						<h3 class="page-panel-title">The Platform</h3>
						<p class="page-panel-copy">
							Engineering leadership, AI architecture, and open source tools — built in the open and returned to the community with the same energy they were taken from.
						</p>
					</article>
					<article class="page-panel">
						<h3 class="page-panel-title">The Philosophy</h3>
						<p class="page-panel-copy">Every line of code is a choice. Every decision, deliberate. Build like it matters — because it does. Complexity is allowed. Confusion is not.</p>
					</article>
					<article class="page-panel wide">
						<h3 class="page-panel-title">Gustavo Ocanto — Co-founder</h3>
						<div class="relative min-h-[5rem]">
							<p class="page-panel-copy">
								Gustavo is a full-stack software engineer and engineering leader with over two decades of experience building complex web systems, AI-powered platforms, and high-trust
								client products across banking, insurance, and SaaS. He works across Go, Node.js, TypeScript, and PHP, with practical depth in Laravel, Vue, Symfony, and Next.js.
							</p>
							<p class="page-panel-copy mt-4">
								He leads with precision, calm thinking, and a bias for strong fundamentals over short-lived momentum. Follow his work and connect on LinkedIn.
							</p>
							<div class="mt-6">
								<a v-if="linkedinUrl !== '#'" v-lazy-link :href="linkedinUrl" target="_blank" rel="noopener noreferrer" class="btn-primary"> View LinkedIn Profile → </a>
								<p v-else-if="profile" class="page-panel-copy">
									Reach out by
									<a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">email</a>
									to connect directly.
								</p>
							</div>
						</div>
					</article>
					<article class="page-panel">
						<h3 class="page-panel-title">Connect</h3>
						<div class="relative min-h-[5rem]">
							<p v-if="profile" key="connect" class="page-panel-copy">
								Reach out by
								<a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">email</a>
								to discuss projects, architecture, or ideas. If there is an interesting system to design or improve, the conversation is open.
							</p>
							<AboutConnectSkeletonPartial v-else key="skeleton" />
						</div>
					</article>
				</div>
			</section>

			<section class="page-support-grid">
				<WidgetSocialTransitionWrapper />
				<WidgetSkillsTransitionWrapper :profile="profile" :is-loading="isLoadingProfile" />
				<div class="page-summary-card">
					<div class="page-section-label">// oullin_signal</div>
					<div class="page-panel-title">Movement is not optional.</div>
					<p class="page-panel-copy">
						Oullin exists to amplify the signal — in engineering, in ideas, and in the people who build. Transformation is not the end state. It is the operating mode.
					</p>
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import NavPartial from '@partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import WidgetSocialTransitionWrapper from '@components/WidgetSocialTransitionWrapper.vue';
import AboutConnectSkeletonPartial from '@partials/AboutConnectSkeletonPartial.vue';
import WidgetSkillsTransitionWrapper from '@components/WidgetSkillsTransitionWrapper.vue';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';

import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { ProfileResponse, SocialResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const socialLinks = ref<SocialResponse[]>([]);
const isLoadingProfile = ref(true);

const linkedinUrl = computed<string>(() => {
	return socialLinks.value.find((s) => s.name.toLowerCase() === 'linkedin')?.url ?? '#';
});

useSeo({
	title: 'About',
	image: ABOUT_IMAGE,
	url: siteUrlFor('/about'),
	imageAlt: `${SITE_NAME} portrait`,
	keywords: buildKeywords('oullin brand', 'gustavo ocanto co-founder', 'engineering leadership ai architecture'),
	description: `Oullin is a platform built on movement and transformation. Meet Gustavo Ocanto, co-founder and engineering leader with 20+ years building reliable software and AI systems.`,
	jsonLd: [
		{
			name: 'About',
			'@type': 'AboutPage',
			url: siteUrlFor('/about'),
			'@context': 'https://schema.org',
			description: `Oullin is a platform for engineering, AI architecture, and open source — co-founded by Gustavo Ocanto.`,
		},
		PERSON_JSON_LD,
	],
});

onMounted(async () => {
	try {
		const [profileResponse, socialResponse] = await Promise.all([apiStore.getProfile(), apiStore.getSocial()]);

		if (profileResponse.data) {
			profile.value = profileResponse.data;
		}

		if (socialResponse.data) {
			socialLinks.value = socialResponse.data;
		}
	} catch (error) {
		debugError(error);
	} finally {
		isLoadingProfile.value = false;
	}
});
</script>
