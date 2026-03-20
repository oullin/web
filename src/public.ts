import type { Router as VueRouter } from 'vue-router';

const IMG_DIR = 'images';

export function image(filename: string): string {
	return `/${IMG_DIR}/${filename}`;
}

export function date(language?: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
	const lang = language || 'en-GB';

	const ops = options || {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	};

	return new Intl.DateTimeFormat(lang, ops);
}

export function readTime(text: string, wpm: number = 225): string {
	if (!text || !text.trim() || wpm <= 0) {
		return '1 min read';
	}

	const wordCnt: number = text.trim().split(/\s+/).length;
	const totalMin: number = Math.ceil(wordCnt / wpm);

	// Ensure a minimum of 1 minute for any content
	const minutes: number = Math.max(1, totalMin);

	// --- Formatting Steps ---
	if (minutes < 60) {
		return `${minutes} min read`;
	}

	const hours: number = Math.floor(minutes / 60);
	const remMins: number = minutes % 60;
	const hourTxt: string = hours > 1 ? 'hours' : 'hour';

	if (remMins === 0) {
		return `${hours} ${hourTxt} read`;
	}

	return `${hours} ${hourTxt} ${remMins} min read`;
}

export function randInt(min: number, max: number): number {
	if (min > max) {
		return max;
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function safeHref(url: string, fallback = '#'): string {
	try {
		const protocol = new URL(url, 'https://placeholder.invalid').protocol;

		if (protocol === 'https:' || protocol === 'http:' || protocol === 'mailto:') {
			return url;
		}
	} catch {
		// malformed URL
	}

	return fallback;
}

export function goBack(router: VueRouter): void {
	if (typeof window === 'undefined') {
		router.push({ name: 'Home' });
		return;
	}

	if (window.history.length > 1) {
		router.back();
		return;
	}

	router.push({ name: 'Home' });
}
