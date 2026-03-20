import { computed } from 'vue';
import DOMPurify from 'dompurify';
import { useApiStore } from '@api/store.ts';

export function useTxtHi() {
	const api = useApiStore();
	const srchTerm = computed(() => api.searchTerm.trim());

	const hilite = (text: string | null | undefined): string => {
		if (!text) {
			return '';
		}

		const term = srchTerm.value;

		if (!term) {
			return DOMPurify.sanitize(text);
		}

		// Escape special regex characters in the search term
		const escTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(`(${escTerm})`, 'gi');

		const markedUp = text.replace(regex, '<mark class="bg-fuchsia-100 dark:bg-teal-500/30 text-fuchsia-900 dark:text-teal-100 font-semibold px-1 py-0.5 rounded-sm">$1</mark>');

		return DOMPurify.sanitize(markedUp);
	};

	return { hilite };
}
