<template>
	<div class="max-w-7xl mx-auto">
		<div class="min-h-screen flex">
			<SideNavPartial />

			<!-- Main content -->
			<main class="grow overflow-hidden px-6">
				<div class="rounded-lg w-full h-full max-w-[1072px] mx-auto flex flex-col">
					<HeaderPartial />

					<!-- Content -->
					<div class="grow md:flex space-y-8 md:space-y-0 md:space-x-8 pt-12 md:pt-16 pb-16 md:pb-20">
						<!-- Middle area -->
						<div class="grow">
							<div class="max-w-[700px]">
								<section>
									<!-- Page title -->
									<h1 class="h1 blog-h1">I'm {{ formattedNickname }}. I live in Singapore, where I enjoy the present.</h1>

									<img class="rounded-lg w-full mb-5" :src="aboutPicture" :alt="`Portrait of: ${formattedNickname}`" decoding="async" fetchpriority="high" />

									<!-- Page content -->
									<div class="space-y-8 text-slate-500">
										<div class="space-y-4">
											<p class="block mb-3">
												I am an engineering leader who’s passionate about building reliable and smooth software that strive to make a difference. With over twenty years in
												software development and architecture, I’ve worked extensively with
												<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://go.dev/">GO</a>,
												<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://nodejs.org/en">Node.js</a>,
												<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://www.typescriptlang.org/">TypeScript</a>, and
												<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://www.php.net/">PHP</a>. I’m also comfortable with
												frameworks/libraries such as <a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://laravel.com/">Laravel</a>,
												<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://vuejs.org/">Vue</a>,
												<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://symfony.com/">Symfony</a>, and
												<a v-lazy-link class="blog-link" target="_blank" rel="noopener noreferrer" href="https://nextjs.org/">Next.js</a>.
											</p>
											<p class="block mb-3">
												I’ve led teams in designing and delivering scalable, high-performance systems that run efficiently even in complex environments. Beyond writing code, I
												focus on helping teams work better together by improving workflows and encouraging innovation.
											</p>
											<p class="block mb-3">
												I thrive in fast-paced settings where clear thinking and problem-solving are key, and I’m always committed to delivering high-quality results.
											</p>
											<p class="block mb-3">
												For me, software has always been more than just a job—it’s a way to turn ideas into real solutions. Over the years, I’ve enjoyed tackling challenges,
												learning new technologies, and guiding talented teams to create tools that users and businesses rely on.
											</p>
											<p class="block">
												Today, I combine deep technical skills with thoughtful leadership to help teams push boundaries and build software that grows and scales with purpose.
											</p>
										</div>

										<div class="mt-5 space-y-5">
											<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-300">Let's Connect</h2>
											<p v-if="profile">
												I’m happy to connect by
												<a v-lazy-link class="blog-link" title="send me an email" aria-label="send me an email" :href="`mailto:${profile.email}`"> email </a>
												to discuss projects and ideas. While I’m not always available for freelance or long-term work, please don’t hesitate to reach out anytime.
											</p>
										</div>
									</div>
								</section>
								<!-- content --->
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetSocialPartial />
								<WidgetSkillsSkeletonPartial v-if="isLoadingProfile || !profile" />
								<WidgetSkillsPartial v-else :skills="profile.skills" />
							</div>
						</aside>
					</div>

					<FooterPartial />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import AboutPicture from '@images/profile/about.jpg';
import FooterPartial from '@partials/FooterPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import WidgetSocialPartial from '@partials/WidgetSocialPartial.vue';
import WidgetSkillsPartial from '@partials/WidgetSkillsPartial.vue';
import WidgetSkillsSkeletonPartial from '@partials/WidgetSkillsSkeletonPartial.vue';
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
	description: `${SITE_NAME} is an engineering leader who’s passionate about building reliable and smooth software.`,
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
