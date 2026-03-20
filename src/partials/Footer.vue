<template>
	<div class="footer-stack">
		<div v-if="showMarquee" class="marquee-wrap">
			<div class="marquee-track">
				<span v-for="item in marqueeItems" :key="item" class="marquee-item">{{ item }}</span>
				<span v-for="item in marqueeItems" :key="`dup-${item}`" class="marquee-item" aria-hidden="true">{{ item }}</span>
			</div>
		</div>

		<footer v-bind="attrs" class="site-footer">
			<span>{{ footer.brandLine }}</span>
			<span>{{ footer.tagline }}</span>
			<div class="footer-right">
				<span>
					© {{ currentYear }} ·
					<template v-for="(link, index) in footer.links" :key="link.to">
						<RouterLink v-lazy-link :to="link.to" class="footer-social-link">{{ link.label }}</RouterLink>
						<span v-if="index < footer.links.length - 1"> · </span>
					</template>
					·
					<button type="button" class="footer-social-link footer-link-button" @click="scrollToTop">{{ footer.backToTopLabel }}</button>
				</span>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { RouterLink } from 'vue-router';
import { siteContent } from '@support/content.ts';

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
const { footer } = siteContent;
const marqueeItems = footer.marqueeItems;

const scrollToTop = () => {
	if (typeof window === 'undefined') {
		return;
	}

	window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
