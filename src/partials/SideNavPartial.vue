<template>
	<div class="sticky top-0 w-16 md:w-24 shrink-0 h-screen overflow-y-auto no-scrollbar border-r border-slate-200 dark:border-slate-800">
		<div class="h-full flex flex-col justify-between after:flex-1 after:mt-auto">
			<!-- Sidebar avatar -->
			<div v-if="!isHome" class="flex justify-center my-4">
				<RouterLink v-lazy-link to="/">
					<AvatarPartial width="w-16" height="h-16" loading="lazy" decoding="async" fetchpriority="low" />
				</RouterLink>
			</div>

			<!-- Sidebar menu-->
			<div class="flex-1 grow flex items-center">
				<nav class="w-full">
					<ul class="space-y-4">
						<li class="py-2">
							<!-- home -->
							<RouterLink v-slot="{ href, navigate, isExactActive }" to="/" custom>
								<a v-lazy-link class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">Home</span>
									<svg class="blog-side-nav-icon fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 19" aria-hidden="true">
										<path fill-opacity=".16" d="M4 7v11h13V7l-6.5-5z" />
										<path d="m10.433 3.242-8.837 6.56L.404 8.198l10.02-7.44L20.59 8.194l-1.18 1.614-8.977-6.565ZM16 17V9h2v10H3V9h2v8h11Z" />
									</svg>
								</a>
							</RouterLink>
						</li>

						<!-- about -->
						<li class="py-2">
							<RouterLink v-slot="{ href, navigate, isExactActive }" to="/about" custom>
								<a v-lazy-link class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">About</span>
									<svg class="blog-side-nav-icon fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
										<path fill-opacity=".16" d="M10 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z" />
										<path
											d="M9 5h2v2H9V5Zm0 4h2v6H9V9Zm1-9C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"
										/>
									</svg>
								</a>
							</RouterLink>
						</li>

						<!-- projects -->
						<li class="py-2">
							<RouterLink v-slot="{ href, navigate, isExactActive }" to="/projects" custom>
								<a v-lazy-link class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">Projects</span>
									<svg class="blog-side-nav-icon fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
										<path fill-opacity=".16" d="M1 4h18v10H1z" />
										<path d="M8 3h4V2H8v1ZM6 3V0h8v3h6v12H0V3h6ZM2 5v8h16V5H2Zm14 13v-2h2v4H2v-4h2v2h12Z" />
									</svg>
								</a>
							</RouterLink>
						</li>

						<!-- resume -->
						<li class="py-2">
							<RouterLink v-slot="{ href, navigate, isExactActive }" to="/resume" custom>
								<a v-lazy-link class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">Resume</span>
									<svg class="blog-side-nav-icon fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 20" aria-hidden="true">
										<path fill-opacity=".16" fill-rule="nonzero" d="M1 5h16v14H1z" />
										<path fill-rule="nonzero" d="M2 6v12h14V6H2Zm16-2v16H0V4h18ZM2 2V0h14v2H2Z" />
									</svg>
								</a>
							</RouterLink>
						</li>
					</ul>

					<div v-if="shouldDisplaySocialSection" class="mt-8 flex flex-col items-center space-y-4" data-testid="side-nav-social-links" aria-label="Primary social profiles">
						<span class="text-base font-semibold text-slate-400 dark:text-slate-600" data-testid="side-nav-social-separator" aria-hidden="true">-</span>

						<ul v-if="!isLoadingSocialLinks && socialNavLinks.length > 0" class="flex flex-col items-center space-y-4">
							<li v-for="item in socialNavLinks" :key="item.href" class="py-2">
								<a
									v-lazy-link
									:href="item.href"
									class="h6 blog-side-nav-router-link-a blog-side-nav-router-link-a-resting"
									target="_blank"
									rel="noopener noreferrer"
									:aria-label="item.label"
								>
									<svg class="blog-side-nav-icon fill-current" viewBox="0 0 24 24" aria-hidden="true">
										<path :d="item.icon" />
									</svg>
								</a>
							</li>
						</ul>
						<ul v-else class="flex flex-col items-center space-y-4" aria-hidden="true">
							<li v-for="index in socialSkeletonCount" :key="`social-skeleton-${index}`">
								<span class="block rounded-full blog-side-nav-icon bg-slate-200/70 dark:bg-slate-700/70 animate-pulse"></span>
							</li>
						</ul>
					</div>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouteLocationNormalizedLoaded, RouterLink, useRoute } from 'vue-router';
import AvatarPartial from '@partials/AvatarPartial.vue';
import { computed, onMounted, ref } from 'vue';
import { Social, type SocialNavLink } from '../support/social.ts';

const currentRoute: RouteLocationNormalizedLoaded = useRoute();
const socialService = new Social();
const socialNavLinks = ref<SocialNavLink[]>([]);
const isLoadingSocialLinks = ref(true);
const socialSkeletonCount = 2;

const isHome = computed<boolean>(() => {
	// `path` excludes query strings, ensuring the avatar is hidden on the homepage
	// even when query parameters are present (e.g. `/?foo=bar`).
	return currentRoute.path === '/';
});

const shouldDisplaySocialSection = computed<boolean>(() => {
	return isLoadingSocialLinks.value || socialNavLinks.value.length > 0;
});

function bindIconClassFor(isActive: boolean): string {
	return isActive ? 'blog-side-nav-router-link-a-active' : 'blog-side-nav-router-link-a-resting';
}

onMounted(async () => {
	isLoadingSocialLinks.value = true;

	try {
		const social = await socialService.fetch();
		socialNavLinks.value = socialService.buildNavLinks(social, ['github', 'linkedin']);
	} finally {
		isLoadingSocialLinks.value = false;
	}
});
</script>
