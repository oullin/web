<template>
	<div class="space-y-8">
		<h2 class="h3 font-aspekta text-slate-800 dark:text-slate-100">Education</h2>
		<ul class="space-y-8">
			<!-- Item -->
			<li class="relative group">
				<div
					class="flex items-start before:absolute before:left-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 before:self-start before:ml-[28px] before:-translate-x-1/2 before:translate-y-8 group-last-of-type:before:hidden"
				>
					<div
						class="absolute left-0 h-14 w-14 flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
					>
						<img src="../images/education-icon-01.svg" width="24" height="24" alt="Purdue University" />
					</div>
					<div class="pl-20 space-y-1">
						<div class="text-xs text-slate-500 uppercase">May 2017 <span class="text-slate-400 dark:text-slate-600">·</span> Apr 2020</div>
						<div class="font-aspekta font-[650] text-slate-800 dark:text-slate-100">Master of Technology Science</div>
						<div class="text-sm font-medium text-slate-800 dark:text-slate-100">Purdue University</div>
						<div class="text-sm text-slate-500 dark:text-slate-400">
							Throughout my years at Purdue, I immersed myself in a dynamic learning environment, surrounded by dedicated faculty and talented peers.
						</div>
					</div>
				</div>
			</li>
			<!-- Item -->
			<li class="relative group">
				<div
					class="flex items-start before:absolute before:left-0 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800 before:self-start before:ml-[28px] before:-translate-x-1/2 before:translate-y-8 group-last-of-type:before:hidden"
				>
					<div
						class="absolute left-0 h-14 w-14 flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:bg-linear-to-t dark:from-slate-800 dark:to-slate-800/30 bg-white dark:bg-slate-900 rounded-full"
					>
						<img src="../images/education-icon-02.svg" width="24" height="26" alt="San Jose State UniversitySan Jose State University" />
					</div>
					<div class="pl-20 space-y-1">
						<div class="text-xs text-slate-500 uppercase">May 2013 <span class="text-slate-400 dark:text-slate-600">·</span> Apr 2017</div>
						<div class="font-aspekta font-[650] text-slate-800 dark:text-slate-100">Bachelor of Technology</div>
						<div class="text-sm font-medium text-slate-800 dark:text-slate-100">San Jose State UniversitySan Jose State University</div>
						<div class="text-sm text-slate-500 dark:text-slate-400">
							Throughout my years at SJSU, I immersed myself in a dynamic learning environment, surrounded by dedicated faculty and talented peers.
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'EducationPartial',
};
</script>
