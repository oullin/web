<template>
	<section id="writing" class="hero">
		<HeroCircuitPartial />

		<div class="hero-left">
			<!-- Breathing orb — violet + cyan ambient glow, lighter touch -->
			<div class="orb-bg" aria-hidden="true">
				<div class="orb orb-primary"></div>
				<div class="orb orb-secondary"></div>
			</div>
			<div>
				<p class="eyebrow">{{ hero.eyebrow }}</p>
				<h1>
					<template v-for="(line, i) in hero.headline" :key="i">
						<span v-if="line.accent" class="accent">{{ line.text }}</span>
						<span v-else-if="line.accent2" class="accent2">{{ line.text }}</span>
						<template v-else>{{ line.text }}</template>
						<br />
					</template>
				</h1>
				<p class="hero-sub">
					<template v-for="(line, index) in hero.sub.lines" :key="line">
						<template v-if="index > 0"><br /><br /></template>
						{{ line }}
					</template>
				</p>
			</div>
			<div class="cta-row">
				<RouterLink v-for="cta in hero.cta" :key="cta.to" :to="cta.to" :class="cta.style === 'primary' ? 'btn-primary' : 'btn-ghost'">{{ cta.label }}</RouterLink>
			</div>
		</div>

		<div class="hero-right">
			<div v-for="block in hero.dataBlocks" :key="block.label" class="data-block">
				<div class="data-label">{{ block.label }}</div>

				<template v-if="block.type === 'metric'">
					<div class="data-value" :class="block.valueColor ?? ''">
						{{ block.value }}<small>{{ block.valueSuffix }}</small>
					</div>
					<div class="data-bar" :class="block.bar"></div>
					<div v-if="block.note?.length" class="data-note">
						<template v-for="(line, i) in block.note" :key="i"> <br v-if="i > 0" />{{ line }} </template>
					</div>
				</template>

				<template v-else-if="block.type === 'list'">
					<div class="data-list">
						<span v-for="item in block.items" :key="item">{{ item }}</span>
					</div>
				</template>

				<template v-else-if="block.type === 'quote'">
					<div v-if="block.lines?.length" class="data-quote">
						"<template v-for="(line, i) in block.lines" :key="i"><br v-if="i > 0" />{{ line }}</template
						>"
					</div>
				</template>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import HeroCircuitPartial from '@partials/HeroCircuitPartial.vue';
import { homePageContent } from '@support/content.ts';

const { hero } = homePageContent;
</script>
