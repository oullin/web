<template>
	<nav class="site-nav">
		<div class="nav-inner">
			<RouterLink to="/" class="nav-logo">OULLIN</RouterLink>
			<ul class="nav-links">
				<li><RouterLink to="/writing">writing</RouterLink></li>
				<li><RouterLink to="/projects">projects</RouterLink></li>
				<li><RouterLink to="/about">about</RouterLink></li>
			</ul>
			<div style="display: flex; align-items: center; gap: 20px">
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
