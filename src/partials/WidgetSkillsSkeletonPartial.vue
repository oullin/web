<template>
        <div
                class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 p-5 animate-pulse"
        >
                <div class="h-5 w-48 max-w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                <ul class="mt-4 space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-3">
                        <li v-for="index in 6" :key="`skill-skeleton-${index}`" class="flex items-center gap-x-4">
                                <div class="grow flex items-center gap-x-2 min-w-0">
                                        <span class="h-3 w-3 rounded-full bg-fuchsia-200/60 dark:bg-teal-900/60"></span>
                                        <span class="h-4 w-3/4 max-w-[140px] bg-slate-200 dark:bg-slate-700 rounded"></span>
                                </div>
                                <div class="shrink-0 relative w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div class="absolute inset-y-0 left-0 w-2/3 bg-fuchsia-200/80 dark:bg-teal-800/70"></div>
                                </div>
                        </li>
                </ul>
        </div>
</template>
