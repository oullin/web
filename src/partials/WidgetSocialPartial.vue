<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="flex items-center space-x-3 mb-2">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 blog-side-nav-router-link-a-active">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
				/>
			</svg>
			<span class="text-xs text-slate-400 dark:text-slate-500">Social</span>
		</div>
		<ul v-if="social" role="list" class="mt-5 space-y-2">
			<li>
				<a target="_blank" :href="social.x.url" class="group blog-widgets-social-links">
					<svg viewBox="0 0 24 24" aria-hidden="true" class="blog-widgets-social-svg">
						<path
							d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.728L12.5962 11.6137L17.7652 19.0075H15.6438L11.4257 12.9742V12.9738Z"
						/>
					</svg>
					<span class="ml-4">Follow on X</span>
				</a>
			</li>
			<li>
				<a target="_blank" :href="social.github.url" class="group blog-widgets-social-links">
					<svg viewBox="0 0 24 24" aria-hidden="true" class="blog-widgets-social-svg">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12 2C6.475 2 2 6.588 2 12.253c0 4.537 2.862 8.369 6.838 9.727.5.09.687-.218.687-.487 0-.243-.013-1.05-.013-1.91C7 20.059 6.35 18.957 6.15 18.38c-.113-.295-.6-1.205-1.025-1.448-.35-.192-.85-.667-.013-.68.788-.012 1.35.744 1.538 1.051.9 1.551 2.338 1.116 2.912.846.088-.666.35-1.115.638-1.371-2.225-.256-4.55-1.14-4.55-5.062 0-1.115.387-2.038 1.025-2.756-.1-.256-.45-1.307.1-2.717 0 0 .837-.269 2.75 1.051.8-.23 1.65-.346 2.5-.346.85 0 1.7.115 2.5.346 1.912-1.333 2.75-1.05 2.75-1.05.55 1.409.2 2.46.1 2.716.637.718 1.025 1.628 1.025 2.756 0 3.934-2.337 4.806-4.562 5.062.362.32.675.936.675 1.897 0 1.371-.013 2.473-.013 2.82 0 .268.188.589.688.486a10.039 10.039 0 0 0 4.932-3.74A10.447 10.447 0 0 0 22 12.253C22 6.588 17.525 2 12 2Z"
						/>
					</svg>
					<span class="ml-4">Follow on GitHub</span>
				</a>
			</li>
			<li>
				<a target="_blank" :href="social.linkedin.url" class="group blog-widgets-social-links">
					<svg viewBox="0 0 24 24" aria-hidden="true" class="blog-widgets-social-svg">
						<path
							d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z"
						/>
					</svg>
					<span class="ml-4">Follow on LinkedIn</span>
				</a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@stores/users/user.ts';
import type { SocialMediaMap } from '@stores/users/userType';

const userStore = useUserStore();
const social = ref<SocialMediaMap | null>(null);

onMounted(() => {
	userStore.onBoot(() => {
		social.value = userStore.getSocialMedia();
	});
});
</script>
