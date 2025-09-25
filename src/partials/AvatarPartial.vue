<template>
        <img
                :class="className"
                :src="props.avatar"
                :alt="props.alt"
                :loading="props.loading"
                :decoding="props.decoding"
                :fetchpriority="props.fetchpriority"
        />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import photo from '@images/profile/001.png';

interface Props {
        avatar?: string;
        alt?: string;
        width: string;
        height: string;
        loading?: 'eager' | 'lazy';
        decoding?: 'async' | 'sync' | 'auto';
        fetchpriority?: 'high' | 'low' | 'auto';
}

const props = withDefaults(defineProps<Props>(), {
        width: 'w-20',
        height: 'h-20',
        avatar: photo,
        alt: 'gocanto',
        loading: 'eager',
        decoding: 'async',
        fetchpriority: 'high',
});

const className = computed<string>(() => {
	return `rounded-full p-1 ring-1 ring-fuchsia-200 dark:ring-teal-500 ${props.width} ${props.height}`;
});
</script>
