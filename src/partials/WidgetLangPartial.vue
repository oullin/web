<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="font-aspekta font-[650] mb-3">Languages</div>
		<ul class="space-y-3">
			<li class="flex justify-between items-center">
				<div class="grow inline-flex mr-1.5 truncate"><span class="text-base mr-1.5">🇬🇧</span> <span class="font-aspekta font-[650] text-sm truncate">English</span></div>
				<div
					class="shrink-0 relative w-5 h-5 rounded-full bg-[conic-gradient(var(--color-sky-500)_100%,0,var(--color-slate-200)_0)] dark:bg-[conic-gradient(var(--color-sky-500)_100%,0,var(--color-slate-700)_0)] after:absolute after:inset-0 after:rounded-full after:w-3 after:h-3 after:m-auto after:bg-white dark:after:bg-slate-800"
					role="progressbar"
					aria-valuenow="100"
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</li>
			<li class="flex justify-between items-center">
				<div class="grow inline-flex mr-1.5 truncate"><span class="text-base mr-1.5">🇮🇹</span> <span class="font-aspekta font-[650] text-sm truncate">Italian</span></div>
				<div
					class="shrink-0 relative w-5 h-5 rounded-full bg-[conic-gradient(var(--color-sky-500)_100%,0,var(--color-slate-200)_0)] dark:bg-[conic-gradient(var(--color-sky-500)_100%,0,var(--color-slate-700)_0)] after:absolute after:inset-0 after:rounded-full after:w-3 after:h-3 after:m-auto after:bg-white dark:after:bg-slate-800"
					role="progressbar"
					aria-valuenow="100"
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</li>
			<li class="flex justify-between items-center">
				<div class="grow inline-flex mr-1.5 truncate"><span class="text-base mr-1.5">🇪🇸</span> <span class="font-aspekta font-[650] text-sm truncate">Spanish</span></div>
				<div
					class="shrink-0 relative w-5 h-5 rounded-full bg-[conic-gradient(var(--color-sky-500)_50%,0,var(--color-slate-200)_0)] dark:bg-[conic-gradient(var(--color-sky-500)_50%,0,var(--color-slate-700)_0)] after:absolute after:inset-0 after:rounded-full after:w-3 after:h-3 after:m-auto after:bg-white dark:after:bg-slate-800"
					role="progressbar"
					aria-valuenow="50"
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'WidgetLangPartial',
};
</script>
