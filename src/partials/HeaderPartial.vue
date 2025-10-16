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
						<svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
							<path :class="link.iconClass" :d="link.icon" />
						</svg>
						<span class="sr-only">{{ link.label }}</span>
					</a>
				</div>

				<!-- Light switch -->
				<div class="flex items-center">
					<input id="light-switch" type="checkbox" name="light-switch" class="light-switch sr-only" @click="toggleDarkMode" />
					<label class="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-2 transition-colors" for="light-switch">
						<svg class="dark:hidden h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								class="fill-fuchsia-300 hover:fill-fuchsia-600"
								d="M10.5 0h3v3h-3zM19.32 2.455l2.121 2.122-2.122 2.119-2.119-2.121zM21 10.5h3v3h-3zM19.425 21.649l-2.121-2.119 2.119-2.123 2.123 2.121zM10.5 21h3v3h-3zM4.47 21.546l-2.119-2.123 2.121-2.121 2.121 2.123zM0 10.5h3v3H0zM4.575 2.559 6.695 4.68 4.575 6.803 2.454 4.68z"
							/>
							<path class="fill-fuchsia-400 hover:fill-fuchsia-600" d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6Z" />
						</svg>
						<svg class="hidden h-4 w-4 dark:block" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								class="fill-fuchsia-400 hover:fill-fuchsia-200 dark:fill-teal-500 dark:hover:fill-teal-300"
								d="M9.3 1.5C4.8 2.7 1.5 6.9 1.5 11.85 1.5 17.7 6.3 22.5 12.15 22.5c4.95 0 9-3.3 10.35-7.8C14.55 16.8 7.2 9.45 9.3 1.5Z"
							/>
							<path
								class="fill-fuchsia-500 hover:fill-fuchsia-200 dark:fill-teal-500 dark:hover:fill-teal-300"
								d="M18.75 7.5a.9375.9375 0 0 1-.9375-.9375 1.878 1.878 0 0 0-1.875-1.875.9375.9375 0 1 1 0-1.875 1.878 1.878 0 0 0 1.875-1.875.9375.9375 0 1 1 1.875 0c.001 1.035.84 1.873 1.875 1.875a.9375.9375 0 1 1 0 1.875c-1.035.001-1.873.84-1.875 1.875a.9375.9375 0 0 1-.9375.9375Z"
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
