<template>
	<div
        class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5"
        @click="sendEmail"
    >
		<div class="flex items-center space-x-3 mb-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" class="fill-current blog-side-nav-router-link-a-active">
				<path
					fill-rule="evenodd"
					d="M.73 6.173a9.92 9.92 0 0 1 3.527-4.488A9.294 9.294 0 0 1 9.58 0h.737v4.67l.14-.226a9.68 9.68 0 0 1 4.3-3.683A9.205 9.205 0 0 1 20.29.192a9.461 9.461 0 0 1 4.904 2.737 10.143 10.143 0 0 1 2.622 5.12c.37 1.94.18 3.95-.545 5.778a9.92 9.92 0 0 1-3.528 4.488A9.294 9.294 0 0 1 18.42 20h-.737v-4.67a10.459 10.459 0 0 1-.14.226 9.68 9.68 0 0 1-4.3 3.683 9.205 9.205 0 0 1-5.534.569 9.461 9.461 0 0 1-4.904-2.737 10.143 10.143 0 0 1-2.622-5.12C-.186 10.01.004 8 .73 6.173ZM8.841 10V1.573a7.89 7.89 0 0 0-3.766 1.391A8.394 8.394 0 0 0 2.09 6.762a8.808 8.808 0 0 0-.462 4.889 8.583 8.583 0 0 0 2.219 4.332 8.006 8.006 0 0 0 4.15 2.316 7.789 7.789 0 0 0 4.683-.482 8.18 8.18 0 0 0 3.528-2.95 4.958 4.958 0 0 1-2.209.518c-2.849 0-5.158-2.411-5.158-5.385Zm10.316 8.427a7.89 7.89 0 0 0 3.766-1.391 8.393 8.393 0 0 0 2.985-3.798 8.807 8.807 0 0 0 .462-4.889 8.583 8.583 0 0 0-2.219-4.332 8.006 8.006 0 0 0-4.15-2.316 7.789 7.789 0 0 0-4.683.482 8.179 8.179 0 0 0-3.528 2.95A4.958 4.958 0 0 1 14 4.615c2.849 0 5.158 2.411 5.158 5.385v8.427Z"
				/>
			</svg>
			<span class="text-xs text-slate-400 dark:text-slate-500">*Sponsor</span>
		</div>
		<div class="font-aspekta font-[650] mb-1">{{ sponsor.title }}</div>
		<p class="text-sm text-slate-500 dark:text-slate-400">{{ sponsor.description }}</p>
	</div>
</template>

<script setup lang="ts">
interface Sponsor {
	title: string;
	description: string;
}

const sponsor: Sponsor = {
	title: 'Build The Site/App You Want!',
	description: 'Your website should be an asset, not an engineering challenge.',
};

const sendEmail = () => {
    const recipient = 'otnacog@gmail.com';
    const subject = `Inquiry about: ${sponsor.title}`;
    const body = `Hello,\n\nI'm interested in learning more about your services.\n\n"${sponsor.description}"\n\nThanks,`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    window.location.href = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
};
</script>
