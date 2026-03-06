<template>
	<footer class="border-t border-slate-200 dark:border-slate-800">
		<div class="py-8">
			<div class="text-center md:flex md:items-center md:justify-between">
				<div class="text-sm text-slate-500 dark:text-slate-400">
					<span>Copyright &copy; OULLIN - All rights reserved.</span>
					<span class="mx-2">•</span>
					<RouterLink v-lazy-link :to="TERMS_AND_POLICIES_PATH" class="blog-link">Terms and policies</RouterLink>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { TERMS_AND_POLICIES_PATH } from '@/support/routes';
</script>
