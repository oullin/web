<template>
	<section id="writing" class="hero">
		<div class="hero-left">
			<!-- Breathing orb — violet + cyan ambient glow, lighter touch -->
			<div class="orb-bg" aria-hidden="true">
				<div class="orb orb-primary"></div>
				<div class="orb orb-secondary"></div>
			</div>
			<div>
				<p class="eyebrow">OULLIN.IO // SYSTEM ONLINE // OLLIN = MOVEMENT</p>
				<h1>
					EVERY<br />
					<span class="accent">SIGNAL</span><br />
					<span class="accent2">MATTERS.</span>
				</h1>
				<p class="hero-sub">
					In the age of noise, clarity is the rarest resource.<br /><br />
					<strong>Gustavo Ocanto</strong> — Engineering Leader, AI Architect.<br />
					Building systems that think. Writing ideas that move.<br />
					Shipping into the light from the deliberate dark.
				</p>
			</div>
			<div class="cta-row">
				<RouterLink to="/about" class="btn-primary">Enter the system →</RouterLink>
				<RouterLink to="/post/manifesto" class="btn-ghost">Read the manifesto</RouterLink>
			</div>
		</div>

		<div class="hero-right">
			<div class="data-block">
				<div class="data-label">// transformation_index</div>
				<div class="data-value">∞<small>continuous</small></div>
				<div class="data-bar v"></div>
				<div class="data-note">Ollin: the sacred day-sign of movement.<br />Change is not a bug. It is the system.</div>
			</div>
			<div class="data-block">
				<div class="data-label">// presence_level</div>
				<div class="data-value cyan">HIGH<small>/ aware</small></div>
				<div class="data-bar c"></div>
				<div class="data-note">Presence precedes velocity.<br />Quality of motion &gt; speed of motion.</div>
			</div>
			<div class="data-block">
				<div class="data-label">// current_work</div>
				<div class="data-list">
					<span>AI Architecture</span>
					<span>Engineering Leadership</span>
					<span>Open Source</span>
				</div>
			</div>
			<div class="data-block">
				<div class="data-label">// principle.core</div>
				<div class="data-quote">"Build like it matters.<br />Because it does."</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts"></script>
