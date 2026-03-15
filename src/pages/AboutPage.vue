<template>
	<div class="theme min-h-screen">
		<NavPartial />

		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">ABOUT // PRESENCE // SINGAPORE</p>
					<h1 class="page-title">I'm {{ formattedNickname }}. I build with intention.</h1>
					<div class="page-copy">
						<p>
							I am an engineering leader who cares about building reliable software, clear systems, and teams that move with purpose. After more than two decades across software
							development and architecture, I still believe the best work comes from precision, calm thinking, and strong fundamentals.
						</p>
						<p>
							I work comfortably across
							<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://go.dev/">Go</a>,
							<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://nodejs.org/en">Node.js</a>,
							<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://www.typescriptlang.org/">TypeScript</a>, and
							<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://www.php.net/">PHP</a>, with practical depth in
							<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://laravel.com/">Laravel</a>,
							<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://vuejs.org/">Vue</a>,
							<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://symfony.com/">Symfony</a>, and
							<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://nextjs.org/">Next.js</a>.
						</p>
					</div>
					<div class="page-pill-row">
						<span class="page-pill">Engineering leadership</span>
						<span class="page-pill">Software architecture</span>
						<span class="page-pill">Systems thinking</span>
					</div>
				</div>

				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">Location</div>
						<div class="page-panel-title">Singapore</div>
						<div class="page-panel-copy">Building from the present, staying close to the signal, and preferring clarity over noise.</div>
					</div>
					<div class="page-cover-frame">
						<CoverImageLoader class="aspect-[4/5] w-full" :src="aboutPicture" :alt="`Portrait of: ${formattedNickname}`" :width="4032" :height="2268" />
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">What I Optimize For</span>
						<h2 class="page-section-title">Reliable systems, better teams, and software that lasts.</h2>
					</div>
					<p class="page-lead">
						I’ve led teams in high-stakes environments, modernised legacy platforms, and helped organisations turn complex requirements into systems that are easier to operate, evolve, and
						trust.
					</p>
				</div>

				<div class="page-panel-grid">
					<article class="page-panel">
						<h3 class="page-panel-title">Architecture</h3>
						<p class="page-panel-copy">I shape software around durability, observability, and maintainable boundaries instead of short-lived momentum.</p>
					</article>
					<article class="page-panel">
						<h3 class="page-panel-title">Leadership</h3>
						<p class="page-panel-copy">I focus on helping engineers work better together through clearer delivery, stronger communication, and higher standards.</p>
					</article>
					<article class="page-panel">
						<h3 class="page-panel-title">Execution</h3>
						<p class="page-panel-copy">I thrive in fast-moving environments where quality still matters and thoughtful decisions need to survive real operating pressure.</p>
					</article>
					<article class="page-panel wide">
						<h3 class="page-panel-title">Let's Connect</h3>
						<div class="relative min-h-[5rem]">
							<p v-if="profile" key="connect" class="page-panel-copy">
								I'm happy to connect by
								<a v-lazy-link class="blog-link" title="send me an email" aria-label="send me an email" :href="`mailto:${profile.email}`">email</a>
								to discuss projects, architecture, and product ideas. If there is an interesting system to design or improve, I’m open to the conversation.
							</p>
							<AboutConnectSkeletonPartial v-else key="skeleton" />
						</div>
					</article>
					<article class="page-panel">
						<div class="page-stat-value">{{ profile ? profile.skills.length : '…' }}</div>
						<div class="page-stat-label">Tracked skills in the current profile</div>
					</article>
				</div>
			</section>

			<section class="page-support-grid">
				<WidgetSocialTransitionWrapper />
				<WidgetSkillsTransitionWrapper :profile="profile" :is-loading="isLoadingProfile" />
				<div class="page-summary-card">
					<div class="page-section-label">Operating Principle</div>
					<div class="page-panel-title">Presence before velocity.</div>
					<p class="page-panel-copy">The best systems move quickly because the fundamentals are disciplined, not because the team is improvising at the edges.</p>
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import AboutPicture from '@images/profile/about.jpg';
import NavPartial from '@partials/NavPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import WidgetSocialTransitionWrapper from '@components/WidgetSocialTransitionWrapper.vue';
import AboutConnectSkeletonPartial from '@partials/AboutConnectSkeletonPartial.vue';
import CoverImageLoader from '@components/CoverImageLoader.vue';
import WidgetSkillsTransitionWrapper from '@components/WidgetSkillsTransitionWrapper.vue';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';

import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { ProfileResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const nickname = ref<string>('Gus');
const profile = ref<ProfileResponse | null>(null);
const isLoadingProfile = ref(true);

const aboutPicture = computed<string>(() => {
	return AboutPicture;
});

const formattedNickname = computed((): string => {
	const str = nickname.value;

	return str.charAt(0).toUpperCase() + str.slice(1);
});

useSeo({
	title: 'About',
	image: ABOUT_IMAGE,
	url: siteUrlFor('/about'),
	imageAlt: `${SITE_NAME} portrait`,
	keywords: buildKeywords('engineering leadership', 'software architecture expertise', 'tech mentoring'),
	description: `${SITE_NAME} is an engineering leader who's passionate about building reliable and smooth software.`,
	jsonLd: [
		{
			name: 'About',
			'@type': 'AboutPage',
			url: siteUrlFor('/about'),
			'@context': 'https://schema.org',
			description: `${SITE_NAME} is an engineering leader focused on building reliable, people-first software.`,
		},
		PERSON_JSON_LD,
	],
});

onMounted(async () => {
	try {
		const userProfileResponse = await apiStore.getProfile();

		if (userProfileResponse.data) {
			profile.value = userProfileResponse.data;
			nickname.value = profile.value.nickname;
		}
	} catch (error) {
		debugError(error);
	} finally {
		isLoadingProfile.value = false;
	}
});
</script>
