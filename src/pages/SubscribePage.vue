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
								<div class="space-y-10">
									<section>
										<!-- Page title -->
										<h1 class="h1 font-aspekta mb-5">Never miss an update ✨</h1>
										<!-- Page content -->
										<div class="text-slate-500 dark:text-slate-400 space-y-8">
											<p class="text-lg">
												This newsletter is written by Mark Ivings, who previously worked at Google, Medium, Vimeo, and Qonto. Here is what to expect by subscribing:
											</p>
											<ul class="space-y-4">
												<li class="flex items-start">
													<svg class="w-3 h-3 fill-current text-sky-500 mr-3 mt-1.5 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
														<path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
													</svg>
													<span>Big tech and high-growth startups, from the inside.</span>
												</li>
												<li class="flex items-start">
													<svg class="w-3 h-3 fill-current text-sky-500 mr-3 mt-1.5 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
														<path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
													</svg>
													<span>Actionable advice for engineering managers, software engineers and tech workers.</span>
												</li>
												<li class="flex items-start">
													<svg class="w-3 h-3 fill-current text-sky-500 mr-3 mt-1.5 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
														<path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
													</svg>
													<span>A pulse on the tech market and scoop worth knowing.</span>
												</li>
												<li class="flex items-start">
													<svg class="w-3 h-3 fill-current text-sky-500 mr-3 mt-1.5 shrink-0" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
														<path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"></path>
													</svg>
													<span>An independent viewpoint.</span>
												</li>
											</ul>
											<div>
												<!-- Subscribe form -->
												<form>
													<div class="flex flex-col md:flex-row justify-center max-w-xs mx-auto md:max-w-md md:mx-0">
														<input type="email" class="form-input w-full mb-2 md:mb-0 md:mr-2" placeholder="Your email" aria-label="Your email…" />
														<button class="btn text-white bg-sky-500 hover:bg-sky-600">Subscribe</button>
													</div>
													<!-- Success message -->
													<!-- <p class="text-xs text-slate-500 mt-3 italic">Thanks for subscribing!</p> -->
												</form>
												<div class="flex items-center mt-5">
													<div class="inline-flex -space-x-3 -ml-0.5">
														<img
															class="rounded-full border-2 border-white dark:border-slate-800 box-content"
															src="../images/avatar-01.jpg"
															width="24"
															height="24"
															alt="Avatar 01"
														/>
														<img
															class="rounded-full border-2 border-white dark:border-slate-800 box-content"
															src="../images/avatar-02.jpg"
															width="24"
															height="24"
															alt="Avatar 02"
														/>
														<img
															class="rounded-full border-2 border-white dark:border-slate-800 box-content"
															src="../images/avatar-03.jpg"
															width="24"
															height="24"
															alt="Avatar 03"
														/>
														<img
															class="rounded-full border-2 border-white dark:border-slate-800 box-content"
															src="../images/avatar-04.jpg"
															width="24"
															height="24"
															alt="Avatar 04"
														/>
														<img
															class="rounded-full border-2 border-white dark:border-slate-800 box-content"
															src="../images/avatar-05.jpg"
															width="24"
															height="24"
															alt="Avatar 05"
														/>
													</div>
													<div class="text-sm text-slate-500 ml-3">Join 100K+ developers.</div>
												</div>
											</div>
										</div>
									</section>

									<section>
										<!-- Cards -->
										<div class="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
											<a
												class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 odd:-rotate-1 even:rotate-1 hover:rotate-0 transition-transform duration-700 hover:duration-100 ease-in-out p-5"
												href="#0"
											>
												<div class="flex flex-col h-full">
													<div class="grow">
														<img class="rounded-full mb-2" src="../images/testimonial-01.jpg" width="40" height="40" alt="Testimonial 01" />
														<div class="text-lg font-aspekta font-[650] mb-1">“ Incredible Value “</div>
														<p class="text-sm text-slate-500 dark:text-slate-400 mb-2">
															I was able to quickly master the skills necessary to advance my career. I'm grateful for the resources Mark provided and would recommend him
															to anyone.
														</p>
													</div>
													<div class="text-xs font-aspekta font-[650] text-sky-500">— Mary Coyle</div>
												</div>
											</a>
											<a
												class="rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 odd:-rotate-1 even:rotate-1 hover:rotate-0 transition-transform duration-700 hover:duration-100 ease-in-out p-5"
												href="#0"
											>
												<div class="flex flex-col h-full">
													<div class="grow">
														<img class="rounded-full mb-2" src="../images/testimonial-02.jpg" width="40" height="40" alt="Testimonial 02" />
														<div class="text-lg font-aspekta font-[650] mb-1">“ The Best Newsletter “</div>
														<p class="text-sm text-slate-500 dark:text-slate-400 mb-2">
															I was able to quickly master the skills necessary to advance my career. I'm grateful for the resources Mark provided and would recommend him
															to anyone.
														</p>
													</div>
													<div class="text-xs font-aspekta font-[650] text-sky-500">— Daniel Burka</div>
												</div>
											</a>
										</div>
									</section>
								</div>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
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
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
</script>
