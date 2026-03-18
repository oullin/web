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
				<template v-if="footerLinks.length > 0">
					<a v-for="link in footerLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer" class="footer-social-link">{{ link.label }}</a>
					<span class="footer-sep">·</span>
				</template>
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
import { computed, ref, onMounted, useAttrs } from 'vue';
import { RouterLink } from 'vue-router';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { LinksResponse } from '@api/response/index.ts';
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

const apiStore = useApiStore();
const currentYear = computed(() => new Date().getFullYear());
const attrs = useAttrs();
const marqueeItems = marquee.items;

interface FooterSocialLink {
	label: string;
	href: string;
}

const footerLinks = ref<FooterSocialLink[]>([]);

const shortLabels: Record<string, string> = {
	x: 'X',
	linkedin: 'LINKEDIN',
};

const scrollToTop = () => {
	if (typeof window === 'undefined') {
		return;
	}

	window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(async () => {
	try {
		const response = await apiStore.getLinks();
		const data: LinksResponse[] = response.data ?? [];
		footerLinks.value = data.map((link) => ({ label: shortLabels[link.name] ?? link.name.toUpperCase(), href: link.url }));
	} catch (error) {
		debugError(error);
	}
});
</script>
