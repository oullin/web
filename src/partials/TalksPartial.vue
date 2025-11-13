<template>
	<section>
		<h2 class="font-aspekta text-xl font-[650] mb-5">Popular Talks</h2>

		<!-- Cards -->
		<div class="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
			<transition-group name="fade" mode="out-in" appear>
				<template v-if="isLoadingTalks || talks.length === 0">
					<TalkCardSkeletonPartial v-for="index in 4" :key="`talk-skeleton-${index}`" :is-animated="isLoadingTalks && talks.length === 0" />
				</template>
				<template v-else>
					<a
						v-for="talk in talks"
						:key="talk.uuid"
						v-lazy-link
						class="relative aspect-video rounded-lg overflow-hidden bg-linear-to-tr from-slate-800 to-slate-700 odd:rotate-1 even:-rotate-1 hover:rotate-0 transition-transform duration-700 hover:duration-100 ease-in-out shadow-xl"
						:href="talk.url"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							class="absolute inset-0 w-full h-full object-cover opacity-40 max-w-[336px] max-h-[189px]"
							:src="image(talk.photo)"
							:alt="talk.title"
							loading="lazy"
							decoding="async"
							fetchpriority="low"
						/>
						<div class="h-full relative flex flex-col items-start justify-between before:mt-auto before:flex-1 p-5">
							<div class="flex-1 flex items-center text-lg font-aspekta text-white font-[650]">{{ talk.title }}</div>

							<div class="flex-1 w-full flex justify-end items-end">
								<svg xmlns="http://www.w3.org/2000/svg" width="41" height="41">
									<circle class="fill-white" cx="20" cy="20" r="20" fill-opacity=".88" />
									<path class="fill-fuchsia-500 dark:fill-teal-500" d="m24.765 19.5-6.263-4.375a.626.626 0 0 0-1.002.5v8.75c0 .5.564.812 1.002.5l6.263-4.375a.65.65 0 0 0 0-1Z" />
								</svg>
							</div>
						</div>
					</a>
				</template>
			</transition-group>
		</div>
	</section>
</template>

<script setup lang="ts">
import { image } from '@/public.ts';
import { ref, onMounted } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { TalksResponse } from '@api/response/index.ts';
import TalkCardSkeletonPartial from '@partials/TalkCardSkeletonPartial.vue';

const apiStore = useApiStore();
const talks = ref<TalksResponse[]>([]);
const isLoadingTalks = ref(true);

onMounted(async () => {
	try {
		const talksResponse = await apiStore.getTalks();

		if (talksResponse.data) {
			talks.value = talksResponse.data;
		}
	} catch (error) {
		debugError(error);
	} finally {
		isLoadingTalks.value = false;
	}
});
</script>
