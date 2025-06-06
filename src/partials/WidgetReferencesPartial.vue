<template>
	<div class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5">
		<div class="font-aspekta font-[650] mb-3">References</div>
		<ul class="space-y-3">
			<li>
				<a class="flex justify-between items-center space-x-2 group" href="#0">
					<div class="grow flex items-center space-x-3 truncate">
						<img class="rounded-full" src="../images/reference-01.jpg" width="32" height="32" alt="Mr. Mark Smularkov" />
						<div class="truncate">
							<div class="font-aspekta font-[650] text-sm truncate mb-1">Mr. Mark Smularkov</div>
							<div class="text-xs text-slate-500 dark:text-slate-400">CEO, Acme Tech.</div>
						</div>
					</div>
					<div class="shrink-0 text-sky-500">
						<svg class="fill-current -rotate-45 group-hover:rotate-0 transition-transform ease-out" xmlns="http://www.w3.org/2000/svg" width="14" height="12">
							<path d="M9.586 5 6.293 1.707 7.707.293 13.414 6l-5.707 5.707-1.414-1.414L9.586 7H0V5h9.586Z"></path>
						</svg>
					</div>
				</a>
			</li>
			<li>
				<a class="flex justify-between items-center space-x-2 group" href="#0">
					<div class="grow flex items-center space-x-3 truncate">
						<img class="rounded-full" src="../images/reference-02.jpg" width="32" height="32" alt="Jame Kulls" />
						<div class="truncate">
							<div class="font-aspekta font-[650] text-sm truncate mb-1">Jame Kulls</div>
							<div class="text-xs text-slate-500 dark:text-slate-400">CEO, Money Maker</div>
						</div>
					</div>
					<div class="shrink-0 text-sky-500">
						<svg class="fill-current -rotate-45 group-hover:rotate-0 transition-transform ease-out" xmlns="http://www.w3.org/2000/svg" width="14" height="12">
							<path d="M9.586 5 6.293 1.707 7.707.293 13.414 6l-5.707 5.707-1.414-1.414L9.586 7H0V5h9.586Z"></path>
						</svg>
					</div>
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'WidgetReferencesPartial',
};
</script>
