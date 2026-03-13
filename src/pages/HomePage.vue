<template>
	<div class="theme min-h-screen">
		<!-- NAV -->
		<NavPartial />

		<!-- HERO -->
		<HeroPartial />

		<!-- MARQUEE -->
		<div class="marquee-wrap">
			<div class="marquee-track">
				<span class="marquee-item">Movement <em>///</em></span>
				<span class="marquee-item">Transformation <em>///</em></span>
				<span class="marquee-item">Heart <em>///</em></span>
				<span class="marquee-item">Life <em>///</em></span>
				<span class="marquee-item">Ollin <em>///</em></span>
				<span class="marquee-item">Signal <em>///</em></span>
				<span class="marquee-item">Presence <em>///</em></span>
				<span class="marquee-item">Awareness <em>///</em></span>
				<span class="marquee-item">Velocity <em>///</em></span>
				<span class="marquee-item">Renewal <em>///</em></span>
				<!-- duplicate for seamless loop -->
				<span class="marquee-item">Movement <em>///</em></span>
				<span class="marquee-item">Transformation <em>///</em></span>
				<span class="marquee-item">Heart <em>///</em></span>
				<span class="marquee-item">Life <em>///</em></span>
				<span class="marquee-item">Ollin <em>///</em></span>
				<span class="marquee-item">Signal <em>///</em></span>
				<span class="marquee-item">Presence <em>///</em></span>
				<span class="marquee-item">Awareness <em>///</em></span>
				<span class="marquee-item">Velocity <em>///</em></span>
				<span class="marquee-item">Renewal <em>///</em></span>
			</div>
		</div>

		<!-- PRINCIPLES -->
		<section id="principles" class="principles">
			<div class="principle">
				<div class="p-num">[ 01 / PRESENCE ]</div>
				<h2 class="p-title">Presence<br />Is Not<br />Optional.</h2>
				<p class="p-body">Every line of code is a choice. Every decision, deliberate. Move with full attention or don't move at all.</p>
				<div class="p-ghost">01</div>
			</div>
			<div class="principle">
				<div class="p-num">[ 02 / TRANSFORMATION ]</div>
				<h2 class="p-title">Change<br />Is The<br />Engine.</h2>
				<p class="p-body">In Aztec cosmology, the fifth sun was born from sacrifice. Transformation is not failure — it is the source code.</p>
				<div class="p-ghost">02</div>
			</div>
			<div class="principle">
				<div class="p-num">[ 03 / CRAFT ]</div>
				<h2 class="p-title">Build<br />Like It<br />Matters.</h2>
				<p class="p-body">Software that people rely on. Tools that hold up. Ideas that outlast the hype cycle. Because it does.</p>
				<div class="p-ghost">03</div>
			</div>
		</section>

		<!-- ABOUT -->
		<section id="about" class="about-section">
			<div class="about-left">
				<div class="section-tag">// about.maker</div>
				<h2 class="about-name">GUSTAVO<br />OCANTO.</h2>
				<p class="about-body">
					Engineering leader. AI architect. Software engineer.<br /><br />
					The name <strong>Oullin</strong> is a deliberate misspelling of <strong>Ollin</strong> — the Aztec sacred day-sign of movement, transformation. A daily reminder that transformation
					isn't tidy. It's raw. It's real. It's necessary.<br /><br />
					Building tools that move people. Writing ideas that challenge the obvious. Sharing the journey without filtering out the difficulty.
				</p>
			</div>
			<div class="about-right">
				<div class="section-tag">// current.work</div>
				<div class="work-list">
					<div class="work-item">
						<span class="w-idx">[ 01 ]</span>
						<div>
							<div class="w-title">Engineering Leadership</div>
							<div class="w-desc">Growing teams who build with intention and ship with confidence. Velocity that doesn't sacrifice craft.</div>
						</div>
					</div>
					<div class="work-item">
						<span class="w-idx">[ 02 ]</span>
						<div>
							<div class="w-title">AI Architecture</div>
							<div class="w-desc">Designing intelligence that moves — fast, purposeful, aware. Systems built for the edge.</div>
						</div>
					</div>
					<div class="work-item">
						<span class="w-idx">[ 03 ]</span>
						<div>
							<div class="w-title">Open Source</div>
							<div class="w-desc">Tools built in the open. Code returned to the community with the same energy it was taken from.</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<section id="projects" class="cta-section">
			<div class="cta-watermark">MOVE</div>
			<h2 class="cta-head">DON'T<br />WAIT.<br /><span class="accent">MOVE.</span></h2>
			<RouterLink to="/projects" class="btn-primary">Initialize →</RouterLink>
		</section>

		<footer class="site-footer">
			<span>OULLIN // GUSTAVO OCANTO</span>
			<span>MOVEMENT // TRANSFORMATION // HEART // LIFE</span>
			<span>© 2026</span>
		</footer>
	</div>
</template>

<script setup lang="ts">
import HeroPartial from '@/partials/HeroPartial.vue';
import NavPartial from '@/partials/NavPartial.vue';
import { useSeo, SITE_NAME, ABOUT_IMAGE, siteUrlFor, buildKeywords, PERSON_JSON_LD } from '@/support/seo';

useSeo({
	title: 'Home',
	image: ABOUT_IMAGE,
	url: siteUrlFor('/'),
	imageAlt: `${SITE_NAME} profile portrait`,
	keywords: buildKeywords('software engineering leadership', 'technology articles', 'engineering management insights'),
	description: `${SITE_NAME} is a full-stack Software Engineer leader & architect with over two decades of experience in building complex web systems and products.`,
	jsonLd: [
		{
			name: 'Home',
			'@type': 'WebPage',
			url: siteUrlFor('/'),
			'@context': 'https://schema.org',
			description: `${SITE_NAME} shares articles about software engineering, leadership, AI, and architecture.`,
		},
		PERSON_JSON_LD,
	],
});
</script>
