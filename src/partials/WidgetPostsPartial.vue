<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="font-aspekta font-[650] mb-3">Popular Posts</div>
		<ul class="space-y-3">
			<li class="inline-flex">
				<span class="text-sky-500 mr-2">—</span>
				<router-link
					class="font-aspekta font-[650] text-sm inline-flex relative hover:text-sky-500 duration-150 ease-out before:scale-x-0 before:origin-center before:absolute before:inset-0 before:bg-sky-200 dark:before:bg-sky-500 before:opacity-30 before:-z-10 before:translate-y-1/4 before:-rotate-2 hover:before:scale-100 before:duration-150 before:ease-in-out"
					to="/post"
					>Writing My First Security Blogpost</router-link
				>
			</li>
			<li class="inline-flex">
				<span class="text-sky-500 mr-2">—</span>
				<router-link
					class="font-aspekta font-[650] text-sm inline-flex relative hover:text-sky-500 duration-150 ease-out before:scale-x-0 before:origin-center before:absolute before:inset-0 before:bg-sky-200 dark:before:bg-sky-500 before:opacity-30 before:-z-10 before:translate-y-1/4 before:-rotate-2 hover:before:scale-100 before:duration-150 before:ease-in-out"
					to="/post"
					>JavaScript print Events</router-link
				>
			</li>
			<li class="inline-flex">
				<span class="text-sky-500 mr-2">—</span>
				<router-link
					class="font-aspekta font-[650] text-sm inline-flex relative hover:text-sky-500 duration-150 ease-out before:scale-x-0 before:origin-center before:absolute before:inset-0 before:bg-sky-200 dark:before:bg-sky-500 before:opacity-30 before:-z-10 before:translate-y-1/4 before:-rotate-2 hover:before:scale-100 before:duration-150 before:ease-in-out"
					to="/post"
					>How to Prototype with JavaScript</router-link
				>
			</li>
			<li class="inline-flex">
				<span class="text-sky-500 mr-2">—</span>
				<router-link
					class="font-aspekta font-[650] text-sm inline-flex relative hover:text-sky-500 duration-150 ease-out before:scale-x-0 before:origin-center before:absolute before:inset-0 before:bg-sky-200 dark:before:bg-sky-500 before:opacity-30 before:-z-10 before:translate-y-1/4 before:-rotate-2 hover:before:scale-100 before:duration-150 before:ease-in-out"
					to="/post"
					>Fuzzy Logic in a Hurry</router-link
				>
			</li>
			<li class="inline-flex">
				<span class="text-sky-500 mr-2">—</span>
				<router-link
					class="font-aspekta font-[650] text-sm inline-flex relative hover:text-sky-500 duration-150 ease-out before:scale-x-0 before:origin-center before:absolute before:inset-0 before:bg-sky-200 dark:before:bg-sky-500 before:opacity-30 before:-z-10 before:translate-y-1/4 before:-rotate-2 hover:before:scale-100 before:duration-150 before:ease-in-out"
					to="/post"
					>An Interactive Guide to Flexbox</router-link
				>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'WidgetPostsPartial',
};
</script>
