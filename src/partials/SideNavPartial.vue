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
						<li v-if="navSocialLinks.length" class="py-2" aria-hidden="true">
							<div class="mx-auto h-px w-8 bg-slate-200 dark:bg-slate-700"></div>
						</li>
						<li v-for="link in navSocialLinks" :key="link.name" class="py-2">
							<a
								class="h6 blog-side-nav-router-link-a blog-side-nav-router-link-a-resting"
								:href="link.url"
								target="_blank"
								rel="noopener noreferrer"
								:title="link.title"
								@mouseenter="showTooltip($event, link.title)"
								@mouseleave="hideTooltip"
							>
								<span class="sr-only">{{ link.label }}</span>
								<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
									<path :class="link.iconClass" :d="link.icon" />
								</svg>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>

	<Teleport to="body">
		<div
			v-if="tooltip.show"
			:style="{ top: tooltip.top, left: tooltip.left }"
			class="absolute -translate-x-1/2 -translate-y-full mt-[-8px] whitespace-nowrap text-white text-xs rounded-md py-1 px-3 z-50 bg-slate-900 dark:bg-slate-700 side-nav-tooltip"
		>
			{{ tooltip.content }}
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import AvatarPartial from '@partials/AvatarPartial.vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { useHeaderSocialLinks } from '@/support/social.ts';
import { useTooltip } from '@/support/tooltips.ts';

const currentRoute: RouteLocationNormalizedLoaded = useRoute();
const apiStore = useApiStore();

const social = computed(() => apiStore.social);
const navSocialLinks = useHeaderSocialLinks(social);

const { tooltip, showTooltip, hideTooltip } = useTooltip();

const isHome = computed<boolean>(() => {
	// `path` excludes query strings, ensuring the avatar is hidden on the homepage
	// even when query parameters are present (e.g. `/?foo=bar`).
	return currentRoute.path === '/';
});

function bindIconClassFor(isActive: boolean): string {
	return isActive ? 'blog-side-nav-router-link-a-active' : 'blog-side-nav-router-link-a-resting';
}

onMounted(async () => {
	try {
		await apiStore.fetchSocial();
	} catch (error) {
		debugError(error);
	}
});
</script>
