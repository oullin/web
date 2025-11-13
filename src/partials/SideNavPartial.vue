<template>
	<div class="sticky top-0 w-16 md:w-24 shrink-0 h-screen overflow-y-auto no-scrollbar border-r border-slate-200 dark:border-slate-800">
		<div class="h-full flex flex-col justify-between after:flex-1 after:mt-auto">
			<!-- Sidebar avatar -->
			<div v-if="!isHome" class="flex justify-center my-4">
				<router-link v-lazy-link to="/">
					<AvatarPartial width="w-16" height="h-16" loading="lazy" decoding="async" fetchpriority="low" />
				</router-link>
			</div>

			<!-- Sidebar menu-->
			<div class="flex-1 grow flex items-center">
				<nav class="w-full">
					<ul class="space-y-4">
						<li class="py-2">
							<!-- home -->
							<router-link v-slot="{ href, navigate, isExactActive }" to="/" custom>
								<a v-lazy-link class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">Home</span>
									<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="21" height="19">
										<path fill-opacity=".16" d="M4 7v11h13V7l-6.5-5z" />
										<path d="m10.433 3.242-8.837 6.56L.404 8.198l10.02-7.44L20.59 8.194l-1.18 1.614-8.977-6.565ZM16 17V9h2v10H3V9h2v8h11Z" />
									</svg>
								</a>
							</router-link>
						</li>

						<!-- about -->
						<li class="py-2">
							<router-link v-slot="{ href, navigate, isExactActive }" to="/about" custom>
								<a v-lazy-link class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">About</span>
									<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
										<path fill-opacity=".16" d="M10 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z" />
										<path
											d="M9 5h2v2H9V5Zm0 4h2v6H9V9Zm1-9C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"
										/>
									</svg>
								</a>
							</router-link>
						</li>

						<!-- projects -->
						<li class="py-2">
							<router-link v-slot="{ href, navigate, isExactActive }" to="/projects" custom>
								<a v-lazy-link class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">Projects</span>
									<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
										<path fill-opacity=".16" d="M1 4h18v10H1z" />
										<path d="M8 3h4V2H8v1ZM6 3V0h8v3h6v12H0V3h6ZM2 5v8h16V5H2Zm14 13v-2h2v4H2v-4h2v2h12Z" />
									</svg>
								</a>
							</router-link>
						</li>

						<!-- resume -->
						<li class="py-2">
							<router-link v-slot="{ href, navigate, isExactActive }" to="/resume" custom>
								<a v-lazy-link class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">Resume</span>
									<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="20">
										<path fill-opacity=".16" fill-rule="nonzero" d="M1 5h16v14H1z" />
										<path fill-rule="nonzero" d="M2 6v12h14V6H2Zm16-2v16H0V4h18ZM2 2V0h14v2H2Z" />
									</svg>
								</a>
							</router-link>
						</li>
					</ul>

					<div v-if="socialNavLinks.length > 0" class="mt-8 flex flex-col items-center space-y-4" data-testid="side-nav-social-links" aria-label="Primary social profiles">
						<span class="text-base font-semibold text-slate-400 dark:text-slate-600" data-testid="side-nav-social-separator" aria-hidden="true">-</span>

						<ul class="flex flex-col items-center space-y-4">
							<li v-for="item in socialNavLinks" :key="item.href">
								<a
									v-lazy-link
									:href="item.href"
									class="text-slate-400 transition-colors duration-150 ease-in-out hover:text-fuchsia-500 dark:text-slate-500 dark:hover:text-teal-600"
									target="_blank"
									rel="noopener noreferrer"
									:aria-label="item.label"
								>
									<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
										<path :d="item.icon" />
									</svg>
								</a>
							</li>
						</ul>
					</div>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import AvatarPartial from '@partials/AvatarPartial.vue';
import { computed } from 'vue';

const currentRoute: RouteLocationNormalizedLoaded = useRoute();

const isHome = computed<boolean>(() => {
	// `path` excludes query strings, ensuring the avatar is hidden on the homepage
	// even when query parameters are present (e.g. `/?foo=bar`).
	return currentRoute.path === '/';
});

function bindIconClassFor(isActive: boolean): string {
	return isActive ? 'blog-side-nav-router-link-a-active' : 'blog-side-nav-router-link-a-resting';
}

interface SocialNavLink {
	href: string;
	label: string;
	icon: string;
}

const socialNavLinks: SocialNavLink[] = [
	{
		href: 'https://x.com/gocanto',
		label: 'Follow on X',
		icon: 'M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z',
	},
	{
		href: 'https://www.linkedin.com/in/gocanto/',
		label: 'Connect on LinkedIn',
		icon: 'M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M8.5 18H5.5V10H8.5V18M6.94 8.5C6.16 8.5 5.5 7.83 5.5 7C5.5 6.17 6.16 5.5 6.94 5.5C7.72 5.5 8.38 6.17 8.38 7C8.38 7.83 7.72 8.5 6.94 8.5M18.5 18H15.5V14.25C15.5 13.17 14.67 12.25 13.5 12.25C12.5 12.25 11.5 13 11.5 14.25V18H8.5V10H11.5V11.25C12.06 10.25 13 9.5 14.25 9.5C16.5 9.5 18.5 11.25 18.5 14V18Z',
	},
	{
		href: 'https://github.com/gocanto',
		label: 'Explore on GitHub',
		icon: 'M12 2A10 10 0 0 0 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 4.97 16.5 4.97 16.5C4.05 15.82 5.06 15.82 5.06 15.82C6.06 15.89 6.63 16.83 6.63 16.83C7.5 18.31 8.95 17.88 9.5 17.61C9.58 17.03 9.84 16.6 10.12 16.34C7.89 16.1 5.5 15.27 5.5 11.5C5.5 10.39 5.89 9.53 6.5 8.84C6.38 8.58 6.08 7.7 6.63 6.5C6.63 6.5 7.43 6.26 9.5 7.7C10.27 7.5 11.14 7.39 12 7.39C12.86 7.39 13.73 7.5 14.5 7.7C16.57 6.26 17.37 6.5 17.37 6.5C17.92 7.7 17.62 8.58 17.5 8.84C18.11 9.53 18.5 10.39 18.5 11.5C18.5 15.27 16.1 16.1 13.88 16.34C14.24 16.64 14.5 17.27 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z',
	},
];
</script>
