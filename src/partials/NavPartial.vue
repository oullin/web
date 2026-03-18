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
								<RouterLink :to="link.to">{{ link.label }}</RouterLink>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<!-- Right column: desktop theme toggle + mobile hamburger -->
			<div class="nav-inner-right">
				<button type="button" class="nav-theme-icon hidden md:flex" :aria-pressed="isDark" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleDarkMode">
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
							<div class="nav-sheet-footer">
								<button type="button" class="nav-theme-icon" :aria-pressed="isDark" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleDarkMode">
									<Sun v-if="isDark" :size="18" />
									<Moon v-else :size="18" />
								</button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Menu, Moon, Sun } from 'lucide-vue-next';
import { useDarkMode } from '@/dark-mode.ts';
import { NavigationMenu, NavigationMenuLink, NavigationMenuItem, NavigationMenuList } from '@components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@components/ui/sheet';

const { isDark, toggleDarkMode } = useDarkMode();

const navLinks = [
	{ to: '/writing', label: 'writing' },
	{ to: '/projects', label: 'projects' },
	{ to: '/about', label: 'about' },
	{ to: '/contact', label: 'contact' },
];
</script>
