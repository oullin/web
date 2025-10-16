<template>
	<header>
		<div class="flex items-center justify-between h-16 before:block">
			<div class="grow flex justify-end space-x-4">
				<!-- Search form -->
				<form class="w-full max-w-[276px]" @submit.prevent="performSearch">
					<div class="flex flex-wrap">
						<div class="w-full">
							<label class="block text-sm sr-only" for="search">Search</label>
							<div class="relative flex items-center">
								<input id="search" v-model="searchQuery" type="search" class="form-input py-1 w-full pl-10" :class="{ 'border-red-500': validationError }" @keyup="onSearchInput" />
								<div class="absolute inset-0 right-auto flex items-center justify-center">
									<svg v-if="validationError" class="w-4 h-4 shrink-0 mx-3" viewBox="0 0 16 16" title="Clear search" @click="clearSearchAndError">
										<path class="stroke-current text-red-500 cursor-pointer" stroke-width="2" stroke-linecap="round" d="M4 4l8 8m0-8l-8 8" />
									</svg>
									<svg v-else class="w-4 h-4 shrink-0 mx-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
										<path
											class="blog-header-search-icon"
											d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm8.707 12.293a.999.999 0 11-1.414 1.414L11.9 13.314a8.019 8.019 0 001.414-1.414l2.393 2.393z"
										></path>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</form>

				<!-- Social links -->
				<div v-if="headerSocialLinks.length" class="flex items-center gap-2">
					<a
						v-for="link in headerSocialLinks"
						:key="link.name"
						class="relative inline-flex h-8 w-8 items-center justify-center rounded-md p-2 transition-colors"
						:href="link.url"
						target="_blank"
						rel="noopener noreferrer"
						:title="link.title"
					>
						<svg class="h-4 w-4" viewBox="0 0 16 16" aria-hidden="true">
							<path :class="link.iconClass" :d="link.icon" />
						</svg>
						<span class="sr-only">{{ link.label }}</span>
					</a>
				</div>

				<!-- Light switch -->
				<div class="flex items-center">
					<input id="light-switch" type="checkbox" name="light-switch" class="light-switch sr-only" @click="toggleDarkMode" />
					<label class="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-2 transition-colors" for="light-switch">
						<svg class="dark:hidden" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
							<path
								class="fill-fuchsia-300 hover:fill-fuchsia-600"
								d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"
							/>
							<path class="fill-fuchsia-400 hover:fill-fuchsia-600" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
						</svg>
						<svg class="hidden dark:block" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
							<path
								class="fill-fuchsia-400 hover:fill-fuchsia-200 dark:fill-teal-500 dark:hover:fill-teal-300"
								d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z"
							/>
							<path
								class="fill-fuchsia-500 hover:fill-fuchsia-200 dark:fill-teal-500 dark:hover:fill-teal-300"
								d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z"
							/>
						</svg>
						<span class="sr-only">Switch to light / dark version</span>
					</label>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import debounce from 'lodash/debounce';
import { useDarkMode } from '@/dark-mode.ts';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';
import type { SocialResponse } from '@api/response/index.ts';
import { useHeaderSocialLinks } from '@/support/social.ts';

const { toggleDarkMode } = useDarkMode();
const apiStore = useApiStore();

const searchQuery = ref('');
const validationError = ref<string>('');
const social = ref<SocialResponse[]>([]);
const headerSocialLinks = useHeaderSocialLinks(social);

const clearSearchAndError = () => {
	onSearchInput.cancel();
	searchQuery.value = '';
	performSearch();
};

const onSearchInput = debounce(() => {
	performSearch();
}, 500);

const performSearch = () => {
	validationError.value = '';
	const query = searchQuery.value.trim();

	if (query === '') {
		apiStore.setSearchTerm(query);

		return;
	}

	if (query.length < 5) {
		validationError.value = 'Search term must be at least 5 characters.';

		return;
	}

	apiStore.setSearchTerm(query);
};

onMounted(async () => {
	try {
		const socialResponse = await apiStore.getSocial();

		if (socialResponse.data) {
			social.value = socialResponse.data;
		}
	} catch (error) {
		debugError(error);
	}
});
</script>
