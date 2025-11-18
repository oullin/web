import { computed } from 'vue';
import DOMPurify from 'dompurify';
import { useApiStore } from '@api/store.ts';

export function useTextHighlight() {
	const apiStore = useApiStore();
	const searchTerm = computed(() => apiStore.searchTerm.trim());

	const highlight = (text: string | null | undefined): string => {
		if (!text) {
			return '';
		}

		const term = searchTerm.value;

		if (!term) {
			return DOMPurify.sanitize(text);
		}

		// Escape special regex characters in the search term
		const escapedTerm = term.replace(/[.*+?^${}()|[\\]/g, '\\$&');
		const regex = new RegExp(`(${escapedTerm})`, 'gi');

		const highlighted = text.replace(regex, '<mark class="bg-fuchsia-100 dark:bg-teal-500/30 text-fuchsia-900 dark:text-teal-100 font-semibold px-1 py-0.5 rounded-sm">$1</mark>');

		return DOMPurify.sanitize(highlighted);
	};

	return { highlight };
}
