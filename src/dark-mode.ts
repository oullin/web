import { ref, watchEffect } from 'vue';

const isBrowser = typeof window !== 'undefined';
const isDark = ref<boolean>(localStorage.getItem('dark-mode') === 'true');

export function useDarkMode() {
	watchEffect(() => {
		localStorage.setItem('dark-mode', String(isDark.value));

		document.documentElement.classList.toggle('dark', isDark.value);
	});

	function toggleDarkMode(): void {
		isDark.value = !isDark.value;
	}

	return {
		isDark,
		toggleDarkMode,
	};
}
