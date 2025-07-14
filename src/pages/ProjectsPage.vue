<template>
	<div class="max-w-7xl mx-auto">
		<div class="min-h-screen flex">
			<SideNavPartial />

			<!-- Main content -->
			<main class="grow overflow-hidden px-6">
				<div class="w-full h-full max-w-[1072px] mx-auto flex flex-col">
					<HeaderPartial />

					<!-- Content -->
					<div class="grow md:flex space-y-8 md:space-y-0 md:space-x-8 pt-12 md:pt-16 pb-16 md:pb-20">
						<!-- Middle area -->
						<div class="grow">
							<div class="max-w-[700px]">
								<section>
									<!-- Page title -->
									<h1 class="h1 font-aspekta mb-12">Nice stuff I've built</h1>

									<!-- Page content -->
									<div class="space-y-10">
										<div class="mb-5">
											<p>
												Over the years, I’ve built and shared command-line tools and frameworks to tackle real engineering challenges—complete
												with clear docs and automated tests—and partnered with banks, insurers, and fintechs to deliver custom software that balances
												performance, security, and scalability.
											</p>
											<p class="mt-2">
												Feel free to dive into my open-source repos and client case studies to see how I turn
												complex requirements into reliable, maintainable systems.
											</p>
										</div>
										<section>
											<h2 class="font-aspekta text-xl font-[650] mb-6">Open Source / Client Projects</h2>
											<div class="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
												<ProjectCardPartial v-for="item in projects" :key="item.id" :item="item" />
											</div>
										</section>

									</div>
								</section>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetNewsletterPartial />
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
import SideNavPartial from '@partials/SideNavPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import ProjectCardPartial from '@partials/ProjectCardPartial.vue';
import WidgetNewsletterPartial from '@partials/WidgetNewsletterPartial.vue';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
import { useUserStore } from '@stores/users/user.ts';
import type { Project, User } from '@stores/users/userType.ts';
import { onMounted, ref } from '~node_modules/vue';




const userStore = useUserStore();
// const items: Project[] = ref<Project[]>([]);

// onMounted(() => {
// 	userStore.onBoot((profile: User) => {
// 		projects.value = profile.projects;
// 	});
// });

</script>
