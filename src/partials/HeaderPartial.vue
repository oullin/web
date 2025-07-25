<template>
	<header>
		<div class="flex items-center justify-between h-16 before:block">
			<div class="grow flex justify-end space-x-4">
				<!-- Search form -->
				<form class="w-full max-w-[276px]">
					<div class="flex flex-wrap">
						<div class="w-full">
							<label class="block text-sm sr-only" for="search">Search</label>
							<div class="relative flex items-center">
								<input id="search" type="search" class="form-input py-1 w-full pl-10" />
								<div class="absolute inset-0 right-auto flex items-center justify-center">
									<svg class="w-4 h-4 shrink-0 mx-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
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

				<!-- Light switch -->
				<div class="flex flex-col justify-center">
					<input id="light-switch" type="checkbox" name="light-switch" class="light-switch sr-only" @click="toggleDarkMode" />
					<label class="relative cursor-pointer p-2" for="light-switch">
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
import { useDarkMode } from '@/dark-mode.ts';

const { toggleDarkMode } = useDarkMode();
</script>
