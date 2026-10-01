import type { NavigationGuard } from 'vue-router';

const WRITING_ARCHIVE_URL = 'https://writing.gocanto.sh/';

export const createArchiveNavigationGuard = (navigate: (url: string) => void = (url) => window.location.assign(url)): NavigationGuard => {
	return (to, from) => {
		if (to.name === 'Writing' || to.name === 'TagPosts') {
			navigate(WRITING_ARCHIVE_URL);
			return false;
		}

		if (to.name === 'PostDetail' && from.matched.length > 0) {
			// A document request lets Caddy apply each legacy post's canonical redirect.
			navigate(to.fullPath);
			return false;
		}
	};
};
