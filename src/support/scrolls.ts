import { RouterScrollBehavior } from 'vue-router';

export const scrollBehavior: RouterScrollBehavior = (to) => {
	if (to.hash) {
		return { el: to.hash, behavior: 'smooth' };
	}

	const el: HTMLElement | null = document.querySelector('html');

	if (el === null) {
		return;
	}

	el.style.scrollBehavior = 'auto';
	window.scroll({ top: 0 });
	el.style.scrollBehavior = '';
};
