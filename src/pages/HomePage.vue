<template>
	<div class="max-w-7xl mx-auto">
		<div class="min-h-screen flex">
			<SideNavPartial />

			<!-- Main content -->
			<main class="grow overflow-hidden px-6">
				<div class="w-full h-full max-w-[1072px] mx-auto flex flex-col">
					<HeaderPartial />
					<HeroPartial />

					<!-- Content -->
					<div class="grow md:flex space-y-8 md:space-y-0 md:space-x-8 pb-16 md:pb-20">
						<!-- Middle area -->
						<div class="grow">
							<div class="max-w-[700px]">
								<div class="space-y-10">
									<ArticlesListPartial />
									<FeaturedProjectsPartial />
									<TalksPartial />
								</div>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetSkillsPartial />
								<WidgetSponsorPartial />
							</div>
						</aside>
					</div>

					<FooterPartial />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import HeroPartial from '@partials/HeroPartial.vue';
import TalksPartial from '@partials/TalksPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import SideNavPartial from '@partials/SideNavPartial.vue';
import WidgetSkillsPartial from '@partials/WidgetSkillsPartial.vue';
import ArticlesListPartial from '@partials/ArticlesListPartial.vue';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import FeaturedProjectsPartial from '@partials/FeaturedProjectsPartial.vue';

import { onMounted } from 'vue';
import { useApiStore } from '@api/store.ts';
import { debugError } from '@api/http-error.ts';

const apiStore = useApiStore();

onMounted(async () => {
	console.log('Attempting to fetch user profile...');

	try {
		const userProfileResponse = await apiStore.getProfile();

		if (userProfileResponse.data) {
			console.log(`Welcome, ${userProfileResponse.data.name}!`);
		}
	} catch (error) {
		debugError(error);
	}
});
</script>
