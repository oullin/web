<template>
	<footer class="site-footer">
		<span>OULLIN // GUSTAVO OCANTO</span>
		<span>MOVEMENT IS NOT OPTIONAL.</span>
		<div class="footer-right">
			<template v-if="socialLinks.length > 0">
				<a v-for="link in socialLinks" :key="link.label" :href="link.href" target="_blank" rel="noopener noreferrer" class="footer-social-link">{{ link.label }}</a>
				<span class="footer-sep">·</span>
			</template>
			<span>© 2026 · <RouterLink v-lazy-link to="/terms-and-conditions" class="hover:text-white transition-colors">Terms</RouterLink></span>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { SocialResponse } from '@api/response/index.ts';

const apiStore = useApiStore();

interface FooterSocialLink {
	label: string;
	href: string;
}

const socialLinks = ref<FooterSocialLink[]>([]);

const shortLabels: Record<string, string> = {
	x: 'X',
	linkedin: 'LINKEDIN',
};

onMounted(async () => {
	try {
		const response = await apiStore.getSocial();
		const data: SocialResponse[] = response.data ?? [];
		socialLinks.value = data.filter((s) => s.name === 'x' || s.name === 'linkedin').map((s) => ({ label: shortLabels[s.name] ?? s.name.toUpperCase(), href: s.url }));
	} catch (error) {
		debugError(error);
	}
});
</script>
