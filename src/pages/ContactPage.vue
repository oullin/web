<template>
	<div class="theme min-h-screen">
		<NavPartial />

		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">CONTACT // OULLIN // CONVERSATION</p>
					<h1 class="page-title">Contact Oullin.</h1>
					<div class="page-copy">
						<p>Oullin is open to conversations about high-availability software, modernisation, architecture, and digital transformation in the AI era.</p>
						<p>&nbsp;</p>
						<p>If you are working in a regulated or high-trust environment, or need senior technical leadership close to a difficult system, start the conversation here.</p>
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
							<template v-if="profile">Email is the fastest way to reach Oullin for architecture, modernisation, and transformation enquiries.</template>
							<template v-else>Contact details are loading or temporarily unavailable.</template>
						</p>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">Best fit</div>
						<div class="page-meta-list">
							<span><strong>Projects:</strong> modernisation, architecture, resilient delivery</span>
							<span><strong>Environments:</strong> regulated, high-trust, AI-era change</span>
							<span><strong>Approach:</strong> direct, senior, hands-on</span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">Ways to Reach Us</span>
						<h2 class="page-section-title">Choose the channel that suits the conversation.</h2>
					</div>
					<p class="page-lead">
						For most enquiries, email first. Many conversations start with a strained system, a modernisation effort, or an AI initiative that needs stronger engineering judgement.
					</p>
				</div>

				<div class="page-editorial">
					<div class="page-editorial-row">
						<span class="page-section-label">Email</span>
						<div>
							<p v-if="profile" class="page-panel-copy">
								Use <a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">{{ profile.email }}</a> for architecture, modernisation, advisory, and transformation
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
import NavPartial from '@partials/NavPartial.vue';
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
	description: 'Contact Oullin about architecture, modernisation, highly available software, regulated systems, and digital transformation in the AI era.',
	keywords: buildKeywords('contact Oullin', 'software architecture', 'digital transformation', 'regulated systems', 'technical advisory', 'highly available software'),
	jsonLd: [
		{
			'@context': 'https://schema.org',
			'@type': 'ContactPage',
			name: 'Contact',
			url: siteUrlFor('/contact'),
			description: 'Contact Oullin about architecture, modernisation, resilient systems, and AI-era transformation work.',
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
