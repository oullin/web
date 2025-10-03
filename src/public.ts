const IMAGES_DIR = 'images';

export function image(filename: string): string {
	return `/${IMAGES_DIR}/${filename}`;
}

export function date(language?: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
	const lang = language || 'en-US';

	const ops = options || {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	return new Intl.DateTimeFormat(lang, ops);
}

export function getReadingTime(text: string, wpm: number = 225): string {
	if (!text || !text.trim() || wpm <= 0) {
		return '1 min read';
	}

	const wordCount: number = text.trim().split(/\s+/).length;
	const totalMinutes: number = Math.ceil(wordCount / wpm);

	// Ensure a minimum of 1 minute for any content
	const minutes: number = Math.max(1, totalMinutes);

	// --- Formatting Steps ---
	if (minutes < 60) {
		return `${minutes} min read`;
	}

	const hours: number = Math.floor(minutes / 60);
	const remainingMinutes: number = minutes % 60;
	const hourText: string = hours > 1 ? 'hours' : 'hour';

	if (remainingMinutes === 0) {
		return `${hours} ${hourText} read`;
	}

	return `${hours} ${hourText} ${remainingMinutes} min read`;
}

export function getRandomInt(min: number, max: number): number {
	if (min > max) {
		throw new Error('min must be less than or equal to max');
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
}
