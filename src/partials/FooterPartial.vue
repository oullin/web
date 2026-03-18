<template>
	<div class="footer-stack">
		<div v-if="showMarquee" class="marquee-wrap">
			<div class="marquee-track">
				<span v-for="item in marqueeItems" :key="item" class="marquee-item">{{ item }}</span>
				<span v-for="item in marqueeItems" :key="`dup-${item}`" class="marquee-item" aria-hidden="true">{{ item }}</span>
			</div>
		</div>

		<footer v-bind="attrs" class="site-footer">
			<span>OULLIN // MOVEMENT // CRAFT</span>
			<span>MOVEMENT IS NOT OPTIONAL.</span>
			<div class="footer-right">
				<span>
					© {{ currentYear }} ·
					<RouterLink v-lazy-link to="/contact" class="footer-social-link">Contact</RouterLink>
					·
					<RouterLink v-lazy-link to="/terms-and-conditions" class="footer-social-link">Terms</RouterLink>
					·
					<button type="button" class="footer-social-link footer-link-button" @click="scrollToTop">Back to top</button>
				</span>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { RouterLink } from 'vue-router';
import marquee from '@fixtures/marquee.json';

defineOptions({ inheritAttrs: false });

withDefaults(
	defineProps<{
		showMarquee?: boolean;
	}>(),
	{
		showMarquee: false,
	},
);

const currentYear = computed(() => new Date().getFullYear());
const attrs = useAttrs();
const marqueeItems = marquee.items;

const scrollToTop = () => {
	if (typeof window === 'undefined') {
		return;
	}

	window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
