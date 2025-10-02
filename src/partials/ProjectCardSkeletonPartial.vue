<template>
        <div
                class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-gradient-to-t dark:from-slate-800 dark:to-slate-800/30 p-5 animate-pulse"
                :class="wrapperClass"
        >
                <div class="flex flex-col h-full">
                        <div class="grow">
                                <div class="flex items-center justify-between space-x-2">
                                        <div class="h-10 w-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-full mb-2">
                                                <div class="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                        </div>
                                        <div class="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                </div>
                                <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-3/4"></div>
                                <div class="space-y-2">
                                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                                </div>
                        </div>
                        <div class="mt-4 h-3 w-10 bg-slate-200 dark:bg-slate-700 rounded self-end"></div>
                </div>
        </div>
</template>

<script setup lang="ts">
const { wrapperClass } = defineProps<{
        wrapperClass?: string;
}>();
</script>
