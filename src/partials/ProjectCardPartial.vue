<template>
	<a v-lazy-link class="project-card-link group" :href="item.url" target="_blank" rel="noopener noreferrer">
		<div class="project-card-content">
			<div class="grow">
				<div class="flex items-center justify-between space-x-2 mb-4">
					<component :is="projectIcon" class="h-5 w-5" style="color: var(--cyan)" />
					<Badge v-if="item.is_open_source" variant="secondary" class="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400">Open-Source</Badge>
				</div>
				<div
					class="font-aspekta font-[650] mb-2 text-sm"
					style="color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem"
				>
					{{ item.language }}
				</div>
				<div class="text-lg font-aspekta font-[650] mb-2" style="color: var(--text)">{{ item.title }}</div>
				<div v-if="projectTimestamp" class="mb-3 text-[0.64rem] uppercase tracking-[0.12em]" style="color: var(--cyan); font-family: 'JetBrains Mono', monospace">
					{{ projectTimestamp.label }} {{ projectTimestamp.value }}
				</div>
				<p class="text-sm leading-relaxed" style="color: var(--muted); font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; line-height: 1.9">{{ item.excerpt }}</p>
			</div>
			<div class="flex justify-end mt-4" style="color: var(--cyan)">
				<svg class="fill-current -rotate-45 group-hover:rotate-0 transition-transform ease-out" xmlns="http://www.w3.org/2000/svg" width="14" height="12">
					<path d="M9.586 5 6.293 1.707 7.707.293 13.414 6l-5.707 5.707-1.414-1.414L9.586 7H0V5h9.586Z" />
				</svg>
			</div>
		</div>
	</a>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';
import {
	ArrowLeftRight,
	Bot,
	Box,
	Briefcase,
	Code2,
	Coins,
	FileCode2,
	FileText,
	GitBranch,
	GitPullRequest,
	Globe,
	Map,
	MapPin,
	Network,
	RefreshCw,
	Server,
	Sheet,
	Sparkles,
	Users,
	Wand2,
	Zap,
} from 'lucide-vue-next';
import type { ProjectsResponse } from '@api/response/index.ts';
import { Badge } from '@components/ui/badge';
import { date } from '@/public.ts';

const { item } = defineProps<{
	item: ProjectsResponse;
}>();

const iconMap: Record<string, Component> = {
	ArrowLeftRight,
	Bot,
	Box,
	Briefcase,
	Coins,
	FileCode2,
	FileText,
	GitBranch,
	GitPullRequest,
	Globe,
	Map,
	MapPin,
	Network,
	RefreshCw,
	Server,
	Sheet,
	Sparkles,
	Users,
	Wand2,
	Zap,
};

const projectIcon = computed(() => iconMap[item.icon] ?? Code2);

const formatProjectDate = (value?: string): string | null => {
	if (!value) {
		return null;
	}

	const parsed = new Date(value);

	if (Number.isNaN(parsed.getTime())) {
		return null;
	}

	return date().format(parsed);
};

const projectTimestamp = computed(() => {
	const publishedAt = formatProjectDate(item.published_at);
	if (publishedAt) {
		return { label: 'Published', value: publishedAt };
	}

	const updatedAt = formatProjectDate(item.updated_at);
	if (updatedAt) {
		return { label: 'Updated', value: updatedAt };
	}

	const createdAt = formatProjectDate(item.created_at);
	if (createdAt) {
		return { label: 'Created', value: createdAt };
	}

	return null;
});
</script>
