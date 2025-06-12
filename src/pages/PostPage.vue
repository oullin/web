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
								<!-- Back -->
								<div class="mb-3">
									<router-link
										class="inline-flex text-sky-500 rounded-full border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30"
										to="/"
									>
										<span class="sr-only">Back</span>
										<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34">
											<path class="fill-current" d="m16.414 17 3.293 3.293-1.414 1.414L13.586 17l4.707-4.707 1.414 1.414z" />
										</svg>
									</router-link>
								</div>

								<article>
									<!-- Post header -->
									<header>
										<div class="flex items-center justify-between mb-1">
											<!-- Post date -->
											<div class="text-xs text-slate-500 uppercase">
												<span class="text-sky-500">—</span> Dec 24, 2023 <span class="text-slate-400 dark:text-slate-600">·</span> 4 Min read
											</div>
											<!-- Share buttons -->
											<ul class="inline-flex">
												<li>
													<a
														class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-500 transition duration-150 ease-in-out"
														href="#0"
														aria-label="Twitter"
													>
														<svg class="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
															<path
																d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z"
															></path>
														</svg>
													</a>
												</li>
												<li>
													<a
														class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-500 transition duration-150 ease-in-out"
														href="#0"
														aria-label="Facebook"
													>
														<svg class="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
															<path
																d="M14.023 24 14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257Z"
															></path>
														</svg>
													</a>
												</li>
												<li>
													<a
														class="flex justify-center items-center text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-500 transition duration-150 ease-in-out"
														href="#0"
														aria-label="Share"
													>
														<svg class="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
															<path
																d="M20 14c1.654 0 3-1.346 3-3s-1.346-3-3-3-3 1.346-3 3c0 .223.029.439.075.649l-3.22 2.012A2.97 2.97 0 0 0 12 13c-1.654 0-3 1.346-3 3s1.346 3 3 3a2.97 2.97 0 0 0 1.855-.661l3.22 2.012c-.046.21-.075.426-.075.649 0 1.654 1.346 3 3 3s3-1.346 3-3-1.346-3-3-3a2.97 2.97 0 0 0-1.855.661l-3.22-2.012c.046-.21.075-.426.075-.649 0-.223-.029-.439-.075-.649l3.22-2.012A2.97 2.97 0 0 0 20 14Z"
															></path>
														</svg>
													</a>
												</li>
											</ul>
										</div>
										<h1 class="h1 font-aspekta mb-4">How to Control CSS Animations with JavaScript</h1>
									</header>
									<!-- Post content -->
									<div class="text-slate-500 dark:text-slate-400 space-y-8">
										<p>When it comes to animations on the web, developers need to measure the animation's requirements with the right technology -- CSS or JavaScript.</p>
										<img class="w-full" src="../images/post-image.jpg" width="692" height="390" alt="Post" />
										<div class="space-y-4">
											<p>
												Web designers sometimes believe that animating in CSS is more difficult than animating in JavaScript.
												<strong class="font-medium text-slate-800 dark:text-slate-100">While CSS animation does have some limitations</strong>, most of the time it's more
												capable than we give it credit for! Not to mention, typically more performant.
											</p>
											<p>
												Coupled with a touch of JavaScript, CSS animations and transitions are able to accomplish hardware-accelerated animations and interactions more
												efficiently than most JavaScript libraries. Let's jump straight in!
											</p>
											<p>Let's jump straight in!</p>
										</div>
										<div class="space-y-4">
											<h2 class="h2 font-aspekta text-slate-800 dark:text-slate-100">Manipulating CSS Transitions</h2>
											<p>
												There are countless questions on coding forums related to triggering and pausing an element's transition. The solution is actually quite simple using
												JavaScript.
											</p>
											<p>To trigger an element's transition, toggle a class name on that element that triggers it.</p>
											<p>
												To pause an element's transition, use getComputedStyle and getPropertyValue at the point in the transition you want to pause it.
												<a class="font-medium text-sky-500 hover:underline" href="#0">Then set those CSS properties</a> of that element equal to those values you just got.
											</p>
										</div>
										<div class="space-y-4">
											<h2 class="h2 font-aspekta text-slate-800 dark:text-slate-100">Using CSS “Callback Functions”</h2>
											<p>
												Some of the most useful yet little-known JavaScript tricks for manipulating CSS transitions and animations are the DOM events they fire. Like:
												<strong class="font-medium text-slate-800 dark:text-slate-100">animationend, animationstart, and animationiteration for animations</strong> and
												transitionend for transitions. You might guess what they do. These animation events fire when the animation on an element ends, starts, or completes one
												iteration, respectively.
											</p>
											<p>
												These events need to be vendor prefixed at this time, so in this demo, we use a function developed by Craig Buckler called PrefixedEvent, which has the
												parameters element, type, and callback to help make these events cross-browser. Here is his useful article on capturing CSS animations with JavaScript.
												And
												<a class="font-medium text-sky-500 hover:underline" href="#0">here is another one</a> determining which animation (name) the event is firing for.
											</p>
										</div>
										<div class="space-y-4">
											<h2 class="h2 font-aspekta text-slate-800 dark:text-slate-100">Manipulating CSS Transitions</h2>
											<p>
												Like we just learned, we can watch elements and react to animation-related events: animationStart, animationIteration, and animationEnd. But what
												happens if you want to change the CSS animation mid-animation? This requires a bit of trickery!
											</p>
										</div>
										<div class="space-y-4">
											<h3 class="h3 font-aspekta text-slate-800 dark:text-slate-100">The animation-play-state Property</h3>
											<p>
												The animation-play-state property of CSS is incredibly helpful when you simply need to pause an animation and potentially continue it later. You can
												change that CSS through JavaScript like this (mind your prefixes):
											</p>
										</div>
										<pre class="overflow-x-auto text-sm text-slate-500 bg-slate-800 p-4 rounded-sm leading-tight">
<code class="font-pt-mono"><span class="text-sky-300">element</span>.<span class="text-sky-300">style</span>.<span class="text-sky-300">webkitAnimationPlayState</span> <span class="text-fuchsia-400">=</span> <span class="text-emerald-400">"paused"</span>;

<span class="text-sky-300">element</span>.<span class="text-sky-300">style</span>.<span class="text-sky-300">webkitAnimationPlayState</span> <span class="text-fuchsia-400">=</span> <span class="text-emerald-400">"running"</span>;</code>
</pre>
										<div class="space-y-4">
											<h3 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Obtaining the Current Keyvalue Percentage</h3>
											<p>
												Unfortunately, at this time, there is no way to get the exact current “percentage completed” of a CSS keyframe animation.
												<strong class="font-medium text-slate-800 dark:text-slate-100">The best method to approximate it is using a setInterval function</strong> that iterates
												100 times during the animation, which is essentially: the animation duration in ms / 100. For example, if the animation is 4 seconds long, then the
												setInterval needs to run every 40 milliseconds (4000/100).
											</p>
										</div>
										<pre class="overflow-x-auto text-sm text-slate-500 bg-slate-800 p-4 rounded-sm leading-tight">
<code class="font-pt-mono"><span class="text-sky-300">var showPercent</span> <span class="text-fuchsia-400">=</span> <span class="text-sky-300">window</span>.<span class="text-sky-300">setInterval</span>(<span class="text-emerald-400">function</span>() {

  <span class="text-emerald-400">if</span> (<span class="text-sky-300">currentPercent</span> <span class="text-fuchsia-400">&lt;</span> <span class="text-pink-400">100</span>) {

    <span class="text-sky-300">currentPercent</span> <span class="text-fuchsia-400">+=</span> <span class="text-pink-400">1</span>;

  } <span class="text-emerald-400">else</span> {

    <span class="text-sky-300">currentPercent</span> <span class="text-fuchsia-400">=</span> <span class="text-pink-400">0</span>;

  }

  // Updates a div that displays the current percent

  <span class="text-sky-300">result</span>.<span class="text-sky-300">innerHTML</span> <span class="text-fuchsia-400">=</span> <span class="text-sky-300">currentPercent</span>;

}, <span class="text-fuchsia-400">40</span>);</code>
</pre>
										<div class="space-y-4">
											<h2 class="h2 font-aspekta text-slate-800 dark:text-slate-100">Use Your Head</h2>
											<p>
												Before starting to code, thinking about and planning how a transition or animation should run is the best way to minimize your problems and get the
												effect you desire. Even better than Googling for solutions later! The techniques and tricks overviewed in this article may not always be the best way to
												create the animation your project calls for.
											</p>
											<p>
												Here's a little example of <strong class="font-medium text-slate-800 dark:text-slate-100">where getting clever with HTML and CSS</strong> alone can
												solve a problem where you might have thought to go to JavaScript.
											</p>
										</div>
										<div class="space-y-4">
											<h2 class="h2 font-aspekta text-slate-800 dark:text-slate-100">In Conclusion</h2>
											<ul class="list-disc list-inside space-y-2">
												<li>Developers used to need to choose between CSS and JavaScript.</li>
												<li>In JavaScript, CSS transitions are generally easier to work with than CSS animations.</li>
												<li>CSS Matrices are generally a pain to deal with, especially for beginners.</li>
												<li>Thinking about what should be done and planning how to do it.</li>
											</ul>
										</div>
									</div>
								</article>
							</div>
						</div>

						<!-- Right sidebar -->
						<aside class="md:w-[240px] lg:w-[300px] shrink-0">
							<div class="space-y-6">
								<WidgetNewsletterPartial />
								<WidgetSponsorPartial />
								<WidgetPostsPartial />
							</div>
						</aside>
					</div>

					<FooterPartial />
				</div>
			</main>
		</div>
	</div>
</template>

<script setup>
import SideNavPartial from '@partials/SideNavPartial.vue';
import HeaderPartial from '@partials/HeaderPartial.vue';
import WidgetNewsletterPartial from '@partials/WidgetNewsletterPartial.vue';
import WidgetSponsorPartial from '@partials/WidgetSponsorPartial.vue';
import WidgetPostsPartial from '@partials/WidgetPostsPartial.vue';
import FooterPartial from '@partials/FooterPartial.vue';
</script>
