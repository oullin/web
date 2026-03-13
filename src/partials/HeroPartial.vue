<template>
	<section id="writing" class="hero">
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
					{{ hero.sub.intro }}<br /><br />
					<strong>{{ hero.sub.author }}</strong> — {{ hero.sub.role }}<br />
					{{ hero.sub.taglines[0] }}<br />
					{{ hero.sub.taglines[1] }}
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
					<div class="data-note">{{ block.note![0] }}<br />{{ block.note![1] }}</div>
				</template>

				<template v-else-if="block.type === 'list'">
					<div class="data-list">
						<span v-for="item in block.items" :key="item">{{ item }}</span>
					</div>
				</template>

				<template v-else-if="block.type === 'quote'">
					<div class="data-quote">"{{ block.lines![0] }}<br />{{ block.lines![1] }}"</div>
				</template>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import hero from '@fixtures/hero.json';
</script>
