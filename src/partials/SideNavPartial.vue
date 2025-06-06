<template>
	<div class="sticky top-0 w-16 md:w-24 shrink-0 h-screen overflow-y-auto no-scrollbar border-r border-slate-200 dark:border-slate-800">
		<div class="h-full flex flex-col justify-between after:flex-1 after:mt-auto">
			<!-- Sidebar avatar -->
			<div v-if="!isHome" class="flex justify-center my-4">
				<router-link to="/">
					<AvatarPartial width="w-16" height="h-16" />
				</router-link>
			</div>

			<!-- Sidebar menu-->
			<div class="flex-1 grow flex items-center">
				<nav class="w-full">
					<ul class="space-y-4">
						<li class="py-2">
							<!-- home -->
							<router-link v-slot="{ href, navigate, isExactActive }" to="/" custom>
								<a
									:class="applyClassIf(['/about', '/subscribe', '/projects', '/resume']) ? 'blog-side-nav-router-link-a-active' : 'blog-side-nav-router-link-a-resting'"
									class="h6 blog-side-nav-router-link-a"
									:href="href"
									@click="navigate"
								>
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
								<a class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
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
								<a class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
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
								<a class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">Resume</span>
									<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="20">
										<path fill-opacity=".16" fill-rule="nonzero" d="M1 5h16v14H1z" />
										<path fill-rule="nonzero" d="M2 6v12h14V6H2Zm16-2v16H0V4h18ZM2 2V0h14v2H2Z" />
									</svg>
								</a>
							</router-link>
						</li>

						<!-- subscribe -->
						<li class="py-2">
							<router-link v-slot="{ href, navigate, isExactActive }" to="/subscribe" custom>
								<a class="h6 blog-side-nav-router-link-a" :class="bindIconClassFor(isExactActive)" :href="href" @click="navigate">
									<span class="sr-only">Subscribe</span>
									<svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="21" height="21">
										<path fill-opacity=".16" d="m13.4 18-3-7.4-7.4-3L19 2z" />
										<path d="M13.331 15.169 17.37 3.63 5.831 7.669l5.337 2.163 2.163 5.337Zm-3.699-3.801L.17 7.53 20.63.37l-7.161 20.461-3.837-9.463Z" />
									</svg>
								</a>
							</router-link>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouteLocationNormalizedLoaded, Router, useRouter } from 'vue-router';
import AvatarPartial from '@partials/AvatarPartial.vue';
import { computed } from 'vue';

const router: Router = useRouter();
const currentRoute: Ref<RouteLocationNormalizedLoaded> = router.currentRoute;

const isHome = computed<boolean>(() => {
	// TypeScript knows currentRoute.value is of type RouteLocationNormalizedLoaded
	// The 'fullPath' property on RouteLocationNormalizedLoaded is typed as string.
	// The comparison 'string === string' results in a boolean.
	// The <boolean> generic on computed explicitly states the return type of the computed ref.
	return currentRoute.value.fullPath === '/';
});

function applyClassIf(constraint: string[]): boolean {
	if (isHome.value) {
		return true;
	}

	const fullPath = currentRoute.value.fullPath;

	return Array.of(constraint).includes(fullPath);
}

function bindIconClassFor(isActive: boolean): string {
	return isActive ? 'blog-side-nav-router-link-a-active' : 'blog-side-nav-router-link-a-resting';
}
</script>
