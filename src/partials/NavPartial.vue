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
						<NavigationMenuItem v-for="link in navLinks" :key="link.to">
							<NavigationMenuLink as-child>
								<RouterLink :to="link.to" class="whitespace-nowrap">{{ link.label }}</RouterLink>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<!-- Right column: social links + desktop theme toggle + mobile hamburger -->
			<div class="nav-inner-right">
				<a :href="linkedinUrl" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="nav-social-link">
					<Linkedin :size="18" />
				</a>
				<a :href="xUrl" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="nav-social-link">
					<Twitter :size="18" />
				</a>
				<a :href="githubUrl" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="nav-social-link">
					<Github :size="18" />
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
								<RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" class="nav-sheet-link">
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
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { Github, Linkedin, Menu, Moon, Sun, Twitter } from 'lucide-vue-next';
import { useDarkMode } from '@/dark-mode.ts';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import { NAV_SOCIAL_FALLBACKS, resolveNavSocialLinks } from '@support/links.ts';
import { siteContent } from '@support/content.ts';
import { NavigationMenu, NavigationMenuLink, NavigationMenuItem, NavigationMenuList } from '@components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@components/ui/sheet';

const { isDark, toggleDarkMode } = useDarkMode();
const apiStore = useApiStore();

const linkedinUrl = ref(NAV_SOCIAL_FALLBACKS.linkedin);
const xUrl = ref(NAV_SOCIAL_FALLBACKS.x);
const githubUrl = ref(NAV_SOCIAL_FALLBACKS.github);

onMounted(async () => {
	try {
		const response = await apiStore.getLinks();
		const resolvedLinks = resolveNavSocialLinks(response.data ?? []);
		linkedinUrl.value = resolvedLinks.linkedin;
		xUrl.value = resolvedLinks.x;
		githubUrl.value = resolvedLinks.github;
	} catch (error) {
		debugError(error);
	}
});

const navLinks = siteContent.nav.links;
</script>
