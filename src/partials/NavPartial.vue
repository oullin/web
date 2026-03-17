<template>
	<nav class="site-nav">
		<div class="nav-inner">
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
			<ul class="nav-links">
				<li><RouterLink to="/writing">writing</RouterLink></li>
				<li><RouterLink to="/projects">projects</RouterLink></li>
				<li><RouterLink to="/about">about</RouterLink></li>
				<li><RouterLink to="/contact">contact</RouterLink></li>
			</ul>
			<div class="flex items-center gap-5">
				<div class="nav-status">
					<span><span class="live-dot"></span>SIGNAL: ACTIVE</span>
					<span>BUILT: 2026.03</span>
					<span>NODE: OULLIN_PRIME</span>
				</div>
				<button type="button" class="nav-theme" :aria-pressed="isDark" @click="toggleDarkMode">{{ isDark ? '☀ LIGHT' : '◑ DARK' }}</button>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useDarkMode } from '@/dark-mode.ts';

const { isDark, toggleDarkMode } = useDarkMode();
</script>
