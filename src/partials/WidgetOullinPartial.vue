<template>
	<Dialog>
		<div class="border p-5" style="border-color: var(--border); background: var(--surface)">
			<div class="mb-4 flex gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-fuchsia-500 dark:bg-slate-700/50 dark:text-fuchsia-400">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7" aria-hidden="true">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
						/>
					</svg>
				</div>
				<div>
					<p class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Movement &amp; Presence</p>
					<h3 class="mt-1 font-aspekta text-lg font-[650] text-slate-800 dark:text-slate-100">What's <span class="blog-fun-title-word-highlight">Oullin?</span></h3>
				</div>
			</div>
			<p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
				In Aztec tradition, Ollin means "movement" or "motion," embodying transformation, heart, life, and the calendar's purified spirit-day. But Ollin goes deeper—it speaks to the same
				gentle momentum at the heart of Zen, where each breath, each step, is a flowing wave of presence.
			</p>
			<DialogTrigger as-child>
				<button
					type="button"
					class="mt-4 inline-flex cursor-pointer items-center text-sm font-medium text-fuchsia-600 transition hover:text-fuchsia-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:text-fuchsia-400 dark:hover:text-fuchsia-300 dark:focus-visible:ring-fuchsia-500"
					data-testid="oullin-dialog-trigger"
				>
					Read more
				</button>
			</DialogTrigger>
		</div>

		<DialogContent :show-close-button="false" class="max-h-[85vh] max-w-2xl overflow-y-auto dark:bg-slate-900" aria-labelledby="oullin-dialog-title">
			<div class="flex items-start justify-between">
				<DialogTitle id="oullin-dialog-title" class="text-xl font-semibold text-slate-900 dark:text-white">What's Oullin?</DialogTitle>
				<DialogClose as-child>
					<button
						type="button"
						class="ml-4 cursor-pointer text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:text-slate-500 dark:hover:text-slate-300 dark:focus-visible:ring-fuchsia-500"
						data-testid="oullin-dialog-close-button"
					>
						<span class="sr-only">Close</span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
							<path
								fill-rule="evenodd"
								d="M10 8.586 4.95 3.536A1 1 0 1 0 3.536 4.95L8.586 10l-5.05 5.05a1 1 0 0 0 1.414 1.414L10 11.414l5.05 5.05a1 1 0 0 0 1.414-1.414L11.414 10l5.05-5.05A1 1 0 0 0 15.05 3.536L10 8.586Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</DialogClose>
			</div>

			<div class="mt-4 space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
				<p>
					In Aztec tradition, Ollin means "movement" or "motion," embodying transformation, heart, life, and the calendar's purified spirit-day. But Ollin goes deeper—it speaks to the same
					gentle momentum at the heart of Zen, where each breath, each step, is a flowing wave of presence.
				</p>
				<p>
					For anyone on the path of self-discovery, Ollin becomes a guide: it reminds us to move with intention, stay grounded in the here and now, and welcome life's shifts as chances to
					grow.
				</p>
				<p>
					Just as Zen teaches us to let thoughts pass like clouds, Ollin's energy urges us to embrace change—transforming every action into a moment of awareness, renewal, and wholehearted
					living.
				</p>
				<p>
					With this brand's name, whether it's spelled oullin or ollin, or another fun variant. I am deliberately riffing on the Aztec Ollin to weave "movement," transformation, and mindful
					flow right into my identity. That little twist in spelling isn't just for show; it's a daily nudge to stay present, move with purpose, and welcome every change as part of my shared
					journey.
				</p>
				<p class="rounded-lg border border-fuchsia-200/70 bg-fuchsia-50/90 p-4 text-[0.95rem] text-slate-700 dark:border-fuchsia-500/40 dark:bg-fuchsia-900/40 dark:text-fuchsia-100">
					Explore the
					<a
						href="https://github.com/oullin"
						class="text-fuchsia-600 decoration-2 decoration-fuchsia-400 transition hover:text-fuchsia-500 hover:decoration-fuchsia-500 dark:text-fuchsia-300 dark:decoration-fuchsia-400 dark:hover:text-fuchsia-200 dark:hover:decoration-fuchsia-200"
						target="_blank"
						rel="noopener noreferrer"
						data-testid="oullin-dialog-oss-link"
					>
						<strong>Oullin</strong> open-source organisation
					</a>
					that powers this site and blog.
				</p>
			</div>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@components/ui/dialog';
</script>
