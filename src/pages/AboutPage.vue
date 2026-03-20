<template>
	<div class="theme min-h-screen about-page">
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
						<div class="page-section-label">{{ sidebar.founder.label }}</div>
						<div class="page-panel-title">{{ sidebar.founder.name }}</div>
						<p class="page-panel-copy">{{ sidebar.founder.copy }}</p>
						<div class="mt-4">
							<a v-lazy-link :href="sidebar.founder.linkUrl" target="_blank" rel="noopener noreferrer" class="blog-link">{{ sidebar.founder.linkLabel }}</a>
						</div>
					</div>
					<div class="page-side-block">
						<div class="page-section-label">{{ sidebar.proof.label }}</div>
						<div class="data-list">
							<span v-for="item in sidebar.proof.items" :key="item">{{ item }}</span>
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
					<template v-for="section in sections" :key="section.label">
						<div class="page-editorial-row">
							<span class="page-section-label">{{ section.label }}</span>
							<div>
								<p v-for="(paragraph, index) in section.paragraphs" :key="paragraph" class="page-panel-copy" :class="{ 'mt-3': index > 0 }">
									{{ paragraph }}
								</p>
							</div>
						</div>
						<div class="page-editorial-sep"></div>
					</template>
					<div class="page-editorial-row">
						<span class="page-section-label">{{ connect.label }}</span>
						<div>
							<p v-if="profile" key="connect" class="page-panel-copy">
								{{ connect.copyBeforeLink }}
								<a v-lazy-link class="blog-link" :href="`mailto:${profile.email}`">{{ connect.linkLabel }}</a>
								{{ connect.copyAfterLink }}
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
import { aboutPageContent, resolveJsonLdArray } from '@support/content.ts';

import { useApiStore } from '@api/store.ts';
import type { ProfileResponse } from '@api/response/index.ts';

const apiStore = useApiStore();
const profile = ref<ProfileResponse | null>(null);
const isLoadingProfile = ref(true);
const hasProfileError = ref(false);
const { hero, sidebar, intro, sections, connect, seo } = aboutPageContent;

useSeo({
	title: seo.title,
	image: SEO_IMAGE,
	url: siteUrlFor('/about'),
	imageAlt: seo.imageAlt ?? `${SITE_NAME} brand story`,
	keywords: buildKeywords(seo.keywords),
	description: seo.description,
	jsonLd: [...resolveJsonLdArray(seo.jsonLd, siteUrlFor), ORGANIZATION_JSON_LD],
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
