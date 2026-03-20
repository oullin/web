import { ref, watchEffect } from 'vue';

const isDark = ref<boolean>(localStorage.getItem('dark-mode') === 'true');

export function useDark() {
	watchEffect(() => {
		localStorage.setItem('dark-mode', String(isDark.value));

		document.documentElement.classList.toggle('dark', isDark.value);
	});

	function togDark(): void {
		isDark.value = !isDark.value;
	}

	return {
		isDark,
		togDark,
	};
}
