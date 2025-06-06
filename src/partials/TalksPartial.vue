<template>
	<section>
		<h2 class="font-aspekta text-xl font-[650] mb-5">Popular Talks</h2>

		<!-- Cards -->
		<div class="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
			<a
				class="relative aspect-video rounded-lg overflow-hidden bg-linear-to-tr from-slate-800 to-slate-700 odd:rotate-1 even:-rotate-1 hover:rotate-0 transition-transform duration-700 hover:duration-100 ease-in-out shadow-xl"
				href="#0"
			>
				<img class="absolute inset-0 w-full h-full object-cover opacity-40" src="../images/popular-post-01.jpg" width="336" height="189" alt="Popular post 01" />
				<div class="h-full relative flex flex-col items-start justify-between before:mt-auto before:flex-1 p-5">
					<div class="flex-1 flex items-center text-lg font-aspekta text-white font-[650]">The Third Age of JavaScript</div>
					<div class="flex-1 w-full flex justify-end items-end">
						<svg xmlns="http://www.w3.org/2000/svg" width="41" height="41">
							<circle class="fill-white" cx="20" cy="20" r="20" fill-opacity=".88" />
							<path class="fill-sky-500" d="m24.765 19.5-6.263-4.375a.626.626 0 0 0-1.002.5v8.75c0 .5.564.812 1.002.5l6.263-4.375a.65.65 0 0 0 0-1Z" />
						</svg>
					</div>
				</div>
			</a>
			<a
				class="relative aspect-video rounded-lg overflow-hidden bg-linear-to-tr from-slate-800 to-slate-700 odd:rotate-1 even:-rotate-1 hover:rotate-0 transition-transform duration-700 hover:duration-100 ease-in-out shadow-xl"
				href="#0"
			>
				<img class="absolute inset-0 w-full h-full object-cover opacity-40" src="../images/popular-post-02.jpg" width="336" height="189" alt="Popular post 02" />
				<div class="h-full relative flex flex-col items-start justify-between before:mt-auto before:flex-1 p-5">
					<div class="flex-1 flex items-center text-lg font-aspekta text-white font-[650]">Building in Public Strategy</div>
					<div class="flex-1 w-full flex justify-end items-end">
						<svg xmlns="http://www.w3.org/2000/svg" width="41" height="41">
							<circle class="fill-white" cx="20" cy="20" r="20" fill-opacity=".88" />
							<path class="fill-sky-500" d="m24.765 19.5-6.263-4.375a.626.626 0 0 0-1.002.5v8.75c0 .5.564.812 1.002.5l6.263-4.375a.65.65 0 0 0 0-1Z" />
						</svg>
					</div>
				</div>
			</a>
		</div>
	</section>
</template>

<script>
export default {
	name: 'TalksPartial',
};
</script>
