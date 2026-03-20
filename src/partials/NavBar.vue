<template>
	<nav class="site-nav">
		<div class="nav-inner">
			<!-- Left column: logo + desktop nav links -->
			<div class="nav-inner-left">
				<RouterLink to="/" class="nav-logo">
					<span class="nav-logo-mark" aria-hidden="true">
						<img :src="isDark ? '/brand/logo-primary-mark-dark.svg' : '/brand/logo-primary-mark-light.svg'" alt="" />
					</span>
					<span class="nav-logo-wordmark" aria-label="Oullin">
						<span class="nav-logo-wordmark-base">ou</span>
						<span class="nav-logo-wordmark-accent">ll</span>
						<span class="nav-logo-wordmark-base">in</span>
					</span>
				</RouterLink>

				<NavigationMenu :viewport="false" class="hidden md:flex">
					<NavigationMenuList>
						<NavigationMenuItem v-for="link in navItems" :key="link.to">
							<NavigationMenuLink as-child>
								<RouterLink :to="link.to" class="whitespace-nowrap">{{ link.label }}</RouterLink>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<!-- Right column: social links + desktop theme toggle + mobile hamburger -->
			<div class="nav-inner-right">
				<a :href="liUrl" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="nav-social-link">
					<LinkedinIcon :size="18" />
				</a>
				<a :href="xUrl" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="nav-social-link">
					<XIcon :size="18" />
				</a>
				<a :href="ghUrl" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="nav-social-link">
					<GithubIcon :size="18" />
				</a>

				<button type="button" class="nav-theme-icon" :aria-pressed="isDark" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleDarkMode">
					<Sun v-if="isDark" :size="18" />
					<Moon v-else :size="18" />
				</button>

				<div class="md:hidden">
					<Sheet>
						<SheetTrigger as-child>
							<button type="button" class="nav-mobile-trigger" aria-label="Open navigation menu">
								<Menu :size="20" />
							</button>
						</SheetTrigger>
						<SheetContent side="right" class="nav-sheet">
							<SheetTitle class="sr-only">Navigation</SheetTitle>
							<nav class="nav-sheet-links" aria-label="Mobile navigation">
								<RouterLink v-for="link in navItems" :key="link.to" :to="link.to" class="nav-sheet-link">
									{{ link.label }}
								</RouterLink>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Menu, Moon, Sun } from 'lucide-vue-next';
import GithubIcon from '@components/icons/GithubIcon.vue';
import LinkedinIcon from '@components/icons/Linkedin.vue';
import XIcon from '@components/icons/XIcon.vue';
import { useDarkMode } from '@/dark-mode.ts';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { NAV_FBKS, navLinks } from '@support/links.ts';
import { siteContent } from '@support/content.ts';
import { runAfterLoadAndIdle, type DeferredCleanup } from '@support/deferred.ts';
import { NavigationMenu, NavigationMenuLink, NavigationMenuItem, NavigationMenuList } from '@components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@components/ui/sheet';

const { isDark, toggleDarkMode } = useDarkMode();
const api = useApiStore();

const liUrl = ref(NAV_FBKS.linkedin);
const xUrl = ref(NAV_FBKS.x);
const ghUrl = ref(NAV_FBKS.github);

let isActive = true;
let cancelJob: DeferredCleanup = () => {};

const loadSocial = async () => {
	try {
		const response = await api.getLinks();

		if (!isActive) {
			return;
		}

		const linkMap = navLinks(response.data ?? []);

		liUrl.value = linkMap.linkedin;
		xUrl.value = linkMap.x;
		ghUrl.value = linkMap.github;
	} catch (error) {
		debugError(error);
	}
};

onMounted(() => {
	cancelJob = runAfterLoadAndIdle(() => {
		void loadSocial();
	});
});

onBeforeUnmount(() => {
	isActive = false;

	cancelJob();
});

const navItems = siteContent.nav.links;
</script>
