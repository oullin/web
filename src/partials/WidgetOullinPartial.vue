<template>
	<div class="rounded-lg border border-slate-200 p-5 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30">
		<div class="font-aspekta text-sm font-[650] uppercase tracking-wide text-slate-500 dark:text-slate-400">What's Oullin?</div>
		<p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
			In Aztec tradition, Ollin means “movement” or “motion,” embodying transformation, heart, life, and the calendar’s purified spirit-day. But Ollin goes deeper—it speaks to the same gentle
			momentum at the heart of Zen, where each breath, each step, is a flowing wave of presence.
		</p>
		<button
			type="button"
			class="mt-3 inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:text-sky-400 dark:hover:text-sky-300"
			@click="openDialog"
		>
			Read more
		</button>
	</div>

	<AccessibleDialog
		v-model="isDialogOpen"
		aria-labelledby="oullin-dialog-title"
		root-class="fixed inset-0 z-50 flex items-center justify-center p-4"
		overlay-class="absolute inset-0 bg-slate-900/70"
		panel-class="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
	>
		<div class="flex items-start justify-between">
			<h2 id="oullin-dialog-title" class="text-xl font-semibold text-slate-900 dark:text-white">What's Oullin?</h2>
			<button
				type="button"
				class="ml-4 text-slate-400 transition hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:text-slate-500 dark:hover:text-slate-300"
				data-testid="oullin-dialog-close-button"
				@click="closeDialog"
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
		</div>

		<div class="mt-4 space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
			<p>
				In Aztec tradition, Ollin means “movement” or “motion,” embodying transformation, heart, life, and the calendar’s purified spirit-day. But Ollin goes deeper—it speaks to the same
				gentle momentum at the heart of Zen, where each breath, each step, is a flowing wave of presence.
			</p>
			<p>
				For anyone on the path of self-discovery, Ollin becomes a guide: it reminds us to move with intention, stay grounded in the here and now, and welcome life’s shifts as chances to grow.
			</p>
			<p>
				Just as Zen teaches us to let thoughts pass like clouds, Ollin’s energy urges us to embrace change—transforming every action into a moment of awareness, renewal, and wholehearted
				living.
			</p>
			<p>
				With this organisation’s name, whether it’s spelled oullin or ollin, or another fun variant. I am deliberately riffing on the Aztec Ollin to weave “movement,” transformation, and
				mindful flow right into my identity. That little twist in spelling isn’t just for show; it’s a daily nudge to stay present, move with purpose, and welcome every change as part of my
				shared journey.
			</p>
		</div>
	</AccessibleDialog>
</template>

<script setup lang="ts">
import AccessibleDialog from '@/components/AccessibleDialog.vue';
import { ref } from 'vue';

const isDialogOpen = ref(false);

const openDialog = () => {
	isDialogOpen.value = true;
};

const closeDialog = () => {
	isDialogOpen.value = false;
};
</script>
