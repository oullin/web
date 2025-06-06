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
										<!-- Side Hustles cards -->
										<section>
											<h2 class="font-aspekta text-xl font-[650] mb-6">Side Hustles</h2>
											<!-- Cards -->
											<div class="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
												<ProjectCardPartial v-for="item in items01" :key="item.id" :item="item" />
											</div>
										</section>
										<!-- Client Projects cards -->
										<section>
											<h2 class="font-aspekta text-xl font-[650] mb-6">Client Projects</h2>
											<!-- Cards -->
											<div class="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
												<ProjectCardPartial v-for="item in items02" :key="item.id" :item="item" />
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

<script>
import { ref } from 'vue';

import SideNavPartial from '@partials/SideNavPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import ProjectCardPartial from '@partials/ProjectCardPartial.vue';
import WidgetNewsletterPartial from '@partials/WidgetNewsletterPartial.vue';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';

import Icon01 from '@images/project-icon-01.svg';
import Icon02 from '@images/project-icon-02.svg';
import Icon03 from '@images/project-icon-03.svg';
import Icon04 from '@images/project-icon-04.svg';
import Icon05 from '@images/project-icon-05.svg';
import Icon06 from '@images/project-icon-06.svg';
import Icon07 from '@images/project-icon-07.svg';
import Icon08 from '@images/project-icon-08.svg';

export default {
	name: 'ProjectsPage',
	components: {
		SideNavPartial,
		HeaderPartial,
		ProjectCardPartial,
		WidgetNewsletterPartial,
		WidgetSponsorPartial,
		FooterPartial,
	},
	setup() {
		const items01 = ref([
			{
				id: 0,
				icon: Icon01,
				slug: '#0',
				title: 'Container Tinkering',
				excerpt: 'Solutions for running containers locally and remotely.',
				openSource: true,
			},
			{
				id: 0,
				icon: Icon02,
				slug: '#0',
				title: 'Engine Prototypes',
				excerpt: 'Solutions for running containers locally and remotely.',
				openSource: false,
			},
		]);

		const items02 = ref([
			{
				id: 0,
				icon: Icon03,
				slug: '#0',
				title: 'PixelOkay',
				excerpt: 'Code assets and services for people, with people.',
				openSource: false,
			},
			{
				id: 1,
				icon: Icon04,
				slug: '#0',
				title: 'Storybook',
				excerpt: 'Storybook helps you develop, test, and document UIs.',
				openSource: false,
			},
			{
				id: 2,
				icon: Icon05,
				slug: '#0',
				title: 'Knowledge AI',
				excerpt: 'Instantly answers all questions based on your internal knowledge bases.',
				openSource: false,
			},
			{
				id: 3,
				icon: Icon06,
				slug: '#0',
				title: 'Security Frame',
				excerpt: 'Automated security compliance for your business.',
				openSource: false,
			},
			{
				id: 4,
				icon: Icon07,
				slug: '#0',
				title: 'KanbanOK',
				excerpt: 'The most powerful kanban board ever invented.',
				openSource: false,
			},
			{
				id: 5,
				icon: Icon08,
				slug: '#0',
				title: 'T Analytics',
				excerpt: 'Make your Twitter analytics pretty and easy to share.',
				openSource: false,
			},
		]);

		return {
			items01,
			items02,
		};
	},
};
</script>
