<template>
	<a v-lazy-link class="project-card-link group" :href="safeHref(item.url)" target="_blank" rel="noopener noreferrer">
		<div class="project-card-content">
			<div class="grow">
				<div class="flex items-center justify-between space-x-2 mb-4">
					<component :is="projectIcon" class="h-5 w-5 project-card-icon" aria-hidden="true" />
					<Badge v-if="item.is_open_source" variant="secondary" class="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400">Open-Source</Badge>
				</div>
				<div class="project-card-language font-aspekta font-[650] mb-2">
					{{ item.language }}
				</div>
				<div class="project-card-title text-lg font-aspekta font-[650] mb-2">{{ item.title }}</div>
				<div v-if="projectTimestamp" class="project-card-timestamp mb-3 text-xs uppercase tracking-[0.12em]">{{ projectTimestamp.label }} {{ projectTimestamp.value }}</div>
				<p class="project-card-excerpt text-sm leading-relaxed">{{ item.excerpt }}</p>
			</div>
			<div class="project-card-arrow flex justify-end mt-4">
				<svg class="fill-current -rotate-45 group-hover:rotate-0 transition-transform ease-out" xmlns="http://www.w3.org/2000/svg" width="14" height="12" aria-hidden="true" focusable="false">
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
	Code2 as FallbackIcon,
	Coins,
	File,
	FileText,
	GitBranch,
	GitPullRequest,
	Globe,
	Map as MapIcon,
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
import { date, safeHref } from '@/public.ts';

const { item } = defineProps<{
	item: ProjectsResponse;
}>();

const iconMap = new Map<string, Component>([
	['ArrowLeftRight', ArrowLeftRight],
	['Bot', Bot],
	['Box', Box],
	['Briefcase', Briefcase],
	['Coins', Coins],
	['FileFallbackIcon', File],
	['FileText', FileText],
	['GitBranch', GitBranch],
	['GitPullRequest', GitPullRequest],
	['Globe', Globe],
	['Map', MapIcon],
	['MapPin', MapPin],
	['Network', Network],
	['RefreshCw', RefreshCw],
	['Server', Server],
	['Sheet', Sheet],
	['Sparkles', Sparkles],
	['Users', Users],
	['Wand2', Wand2],
	['Zap', Zap],
]);

const projectIcon = computed(() => iconMap.get(item.icon) ?? FallbackIcon);

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
