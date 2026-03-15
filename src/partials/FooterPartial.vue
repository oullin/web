<template>
	<footer class="site-footer">
		<span>OULLIN // GUSTAVO OCANTO</span>
		<span>MOVEMENT // TRANSFORMATION // HEART // LIFE</span>
		<span>© 2026 · <RouterLink v-lazy-link :to="TERMS_AND_POLICIES_PATH" class="hover:text-white transition-colors">Terms</RouterLink></span>
	</footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { TERMS_AND_POLICIES_PATH } from '@/support/routes';
</script>
