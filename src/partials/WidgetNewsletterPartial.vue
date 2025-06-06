<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="text-center mb-1">
			<div class="inline-flex -space-x-3 -ml-0.5">
				<img v-for="subs in newsletter.subscribers" :key="subs.id" class="blog-widgets-subscriber-avatar" :src="subs.avatar" width="24" height="24" :alt="subs.name" />
			</div>
		</div>
		<div class="text-center mb-8">
			<div class="font-aspekta font-[650] mb-1">Never miss an update!</div>
			<p class="text-sm text-slate-500 dark:text-slate-400">Subscribe and join {{ newsletter.count }} developers.</p>
		</div>
		<form>
			<div class="mb-2">
				<label class="sr-only" for="newsletter">Your email…</label>
				<input id="newsletter" type="email" class="form-input py-1 w-full" placeholder="Your email…" />
			</div>
			<button class="btn-sm blog-widgets-btn-sm" type="submit">Subscribe</button>
		</form>
	</div>
</template>

<script setup lang="ts">
interface Subscribers {
	id: number;
	name: string;
	avatar: string;
}

interface Newsletter {
	count: string;
	subscribers: Subscribers[];
}

const subscribers: Subscribers[] = [
	{ id: 1, name: '001', avatar: 'avatar-01.jpg' },
	{ id: 2, name: '002', avatar: 'avatar-02.jpg' },
	{ id: 3, name: '003', avatar: 'avatar-03.jpg' },
	{ id: 4, name: '004', avatar: 'avatar-04.jpg' },
	{ id: 5, name: '005', avatar: 'avatar-05.jpg' },
];

const newsletter: Newsletter = {
	count: '101K+',
	subscribers: subscribers.map(
		(sub: Subscribers): Subscribers => ({
			id: sub.id,
			name: sub.name,
			avatar: new URL(`../images/${sub.avatar}`, import.meta.url).href,
		}),
	),
};
</script>
