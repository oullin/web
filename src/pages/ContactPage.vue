<template>
	<div class="theme min-h-screen contact-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">CONTACT // OULLIN // CONVERSATION</p>
					<h1 class="page-title">Contact Oullin.</h1>
					<div class="page-copy">
						<p>Oullin is open to conversations about high-availability software, AI-era modernisation, architecture, and delivery in regulated and high-trust environments.</p>
						<p>&nbsp;</p>
						<p>
							We take a limited number of engagements at a time. If you're working on a system that has to hold — and needs senior engineering judgment close to the architecture — start
							the conversation here.
						</p>
					</div>
				</div>

				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">Primary channel</div>
						<div class="page-panel-title">
							<a v-if="profile" v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
							<span v-else>Direct email</span>
						</div>
						<p class="page-panel-copy">
							<template v-if="profile"
								>Email is the fastest way to reach Oullin for architecture, AI consulting, modernisation, and transformation enquiries. Come with context: your current stack, the
								problem you're trying to solve, and any constraints. We respond within 48 hours to enquiries with enough detail for a real conversation.</template
							>
							<template v-else>Contact details are loading or temporarily unavailable.</template>
						</p>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">Best fit</div>
						<div class="page-meta-list">
							<span><strong>Projects:</strong> AI architecture, modernisation, resilient delivery, banking, healthcare, e-commerce, loyalty and customer engagement</span>
							<span><strong>Environments:</strong> regulated, high-trust, AI-era change, fintech, scale-up, high-availability infrastructure</span>
							<span><strong>Approach:</strong> direct, senior, hands-on, embedded close to delivery</span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">What Happens Next</span>
						<h2 class="page-section-title">Clarity from the first exchange.</h2>
					</div>
					<p class="page-lead">No pitch decks. No proposals that take two weeks. A straight answer from the first conversation.</p>
				</div>

				<div class="page-editorial">
					<div class="page-editorial-row">
						<span class="page-section-label">// process</span>
						<div>
							<div class="page-meta-list">
								<span>— We respond within 48 hours if there's enough context to have a real conversation.</span>
								<span>— If it's a fit, we schedule a 30-minute call — your stack, your problem, your constraints.</span>
								<span>— We give you a straight read: whether we can help, which engagement fits, and what it costs.</span>
								<span>— If we proceed: a one-page scope document within 48 hours.</span>
							</div>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">Email</span>
						<div>
							<p v-if="profile" class="page-panel-copy">
								Use <a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">{{ profile.email }}</a> for architecture, AI consulting, modernisation, and transformation
								discussions.
							</p>
							<p v-else class="page-panel-copy">We are currently unable to load the direct email address. Please try again later.</p>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">Social</span>
						<div>
							<div v-if="visibleLinks.length > 0" class="page-social-links">
								<template v-for="(link, index) in visibleLinks" :key="link.uuid">
									<a v-lazy-link :href="link.url" target="_blank" rel="noopener noreferrer" class="blog-link">
										{{ link.name.toUpperCase() }}
									</a>
									<span v-if="index < visibleLinks.length - 1" class="page-social-separator" aria-hidden="true">/</span>
								</template>
							</div>
							<p v-else class="page-panel-copy">Social channels are currently unavailable. Email remains the best way to reach Oullin.</p>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">Founder</span>
						<div>
							<p class="page-panel-copy">
								Gustavo Ocanto leads Oullin's work directly, so enquiries stay close to architecture, delivery, and technical decision-making rather than getting filtered through
								layers.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import FooterPartial from '@partials/FooterPartial.vue';
import { useApiStore } from '@api/store.ts';
import type { ProfileResponse, LinksResponse } from '@api/response/index.ts';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, ORGANIZATION_JSON_LD } from '@support/seo';

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const links = ref<LinksResponse[]>([]);
const hasProfileError = ref(false);
const hasLinksError = ref(false);
const fallbackLinks: LinksResponse[] = [
	{
		uuid: 'fallback-linkedin',
		name: 'linkedin',
		handle: 'gocanto',
		url: 'https://www.linkedin.com/in/gocanto/',
		description: 'Professional profile',
	},
	{
		uuid: 'fallback-github',
		name: 'github',
		handle: 'gocanto',
		url: 'https://github.com/gocanto',
		description: 'Code and projects',
	},
];

const visibleLinks = computed<LinksResponse[]>(() => {
	return links.value.length > 0 ? links.value : fallbackLinks;
});

useSeo({
	title: 'Contact',
	image: SEO_IMAGE,
	url: siteUrlFor('/contact'),
	imageAlt: `${SITE_NAME} contact page preview`,
	description: 'Start a conversation about AI architecture, modernisation, and delivery in regulated environments. No pitch decks. Clarity from the first exchange.',
	keywords: buildKeywords('contact Oullin', 'AI architecture consulting', 'fractional AI architect', 'regulated systems', 'technical advisory', 'AI-era modernisation'),
	jsonLd: [
		{
			'@context': 'https://schema.org',
			'@type': 'ContactPage',
			name: 'Contact',
			url: siteUrlFor('/contact'),
			description: 'Start a conversation about AI architecture, modernisation, and delivery in regulated environments. We respond within 48 hours.',
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: 'Gustavo Ocanto',
			jobTitle: 'Founder of Oullin',
			url: siteUrlFor('/contact'),
		},
		ORGANIZATION_JSON_LD,
	],
});

const loadContactData = async () => {
	try {
		const profileResponse = await apiStore.getProfile();
		if (profileResponse.data) profile.value = profileResponse.data;
	} catch {
		hasProfileError.value = true;
	}

	try {
		const linksResponse = await apiStore.getLinks();
		if (linksResponse.data) links.value = linksResponse.data;
	} catch {
		hasLinksError.value = true;
	}
};

onMounted(loadContactData);
</script>
