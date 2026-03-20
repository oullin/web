<template>
	<div class="theme min-h-screen contact-page">
		<main class="page-shell">
			<section class="page-hero">
				<div class="page-hero-main">
					<p class="page-kicker">{{ hero.kicker }}</p>
					<h1 class="page-title">{{ hero.title }}</h1>
					<div class="page-copy">
						<p v-for="(paragraph, index) in hero.copy" :key="paragraph" :class="{ 'mt-6': index > 0 }">{{ paragraph }}</p>
					</div>
				</div>

				<div class="page-hero-side">
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.primaryChannel.label }}</div>
						<div class="page-panel-title">
							<a v-if="profile" v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
							<span v-else>{{ sidebar.primaryChannel.fallbackTitle }}</span>
						</div>
						<p class="page-panel-copy">{{ profile ? sidebar.primaryChannel.copy : sidebar.primaryChannel.fallbackCopy }}</p>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.bestFit.label }}</div>
						<div class="page-meta-list">
							<span v-for="item in sidebar.bestFit.items" :key="item" v-html="item"></span>
						</div>
					</div>
				</div>
			</section>

			<section class="page-band">
				<div class="page-band-intro">
					<div>
						<span class="page-section-label">{{ intro.label }}</span>
						<h2 class="page-section-title">{{ intro.title }}</h2>
					</div>
					<p class="page-lead">{{ intro.lead }}</p>
				</div>

				<div class="page-editorial">
					<div class="page-editorial-row">
						<span class="page-section-label">{{ process.label }}</span>
						<div>
							<div class="page-meta-list">
								<span v-for="item in process.items" :key="item">{{ item }}</span>
							</div>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">{{ email.label }}</span>
						<div>
							<p v-if="profile" class="page-panel-copy">
								{{ email.copyBeforeLink }}
								<a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
								{{ email.copyAfterLink }}
							</p>
							<p v-else class="page-panel-copy">We are currently unable to load the direct email address. Please try again later.</p>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">{{ social.label }}</span>
						<div>
							<div v-if="showLinks.length > 0" class="page-social-links">
								<template v-for="(link, index) in showLinks" :key="link.uuid">
									<a v-lazy-link :href="link.url" target="_blank" rel="noopener noreferrer" class="blog-link">
										{{ link.name.toUpperCase() }}
									</a>
									<span v-if="index < showLinks.length - 1" class="page-social-separator" aria-hidden="true">/</span>
								</template>
							</div>
							<p v-else class="page-panel-copy">{{ social.unavailableCopy }}</p>
						</div>
					</div>
					<div class="page-editorial-sep"></div>
					<div class="page-editorial-row">
						<span class="page-section-label">{{ founder.label }}</span>
						<div>
							<p class="page-panel-copy">{{ founder.copy }}</p>
						</div>
					</div>
				</div>
			</section>
		</main>

		<FooterPartial />
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import FooterPartial from '@partials/FooterPartial.vue';
import { useApiStore } from '@api/store.ts';
import type { ProfileResponse, LinksResponse } from '@api/response/index.ts';
import { useSeo, SITE_NAME, SEO_IMAGE, siteUrlFor, buildKeywords, ORGANIZATION_JSON_LD } from '@support/seo';
import { resolveJsonLdArray } from '@support/json-ld.ts';
import { contactPageContent } from '@support/content/contact-page.ts';
import { buildNav, NAV_FBKS, navLinks } from '@support/links.ts';
import { runAfterLoadAndIdle } from '@support/deferred.ts';

const api = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const links = ref<LinksResponse[]>(buildNav(NAV_FBKS));
const hasProf = ref(false);
const hasLinks = ref(false);
const { hero, sidebar, intro, process, email, social, founder, seo } = contactPageContent;
let isActive = true;
let cancelJob = () => {};

const showLinks = computed<LinksResponse[]>(() => links.value);

useSeo({
	title: seo.title,
	image: SEO_IMAGE,
	url: siteUrlFor('/contact'),
	imageAlt: seo.imageAlt ?? `${SITE_NAME} contact page preview`,
	description: seo.description,
	keywords: buildKeywords(seo.keywords),
	jsonLd: [...resolveJsonLdArray(seo.jsonLd, siteUrlFor), ORGANIZATION_JSON_LD],
});

const loadData = async () => {
	try {
		const profRes = await api.getProfile();

		if (profRes.data) {
			profile.value = profRes.data;
		}
	} catch {
		hasProf.value = true;
	}
};

const loadLinks = async () => {
	try {
		const linkRes = await api.getLinks();

		if (!isActive) {
			return;
		}

		const linkMap = navLinks(linkRes.data ?? []);

		links.value = buildNav(linkMap);
	} catch {
		hasLinks.value = true;
	}
};

onMounted(() => {
	void loadData();

	cancelJob = runAfterLoadAndIdle(() => {
		void loadLinks();
	});
});

onBeforeUnmount(() => {
	isActive = false;

	cancelJob();
});
</script>
