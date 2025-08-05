import type { HLJSApi } from 'highlight.js';

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
	//example: min=1, max=8

	// Math.random() returns a floating-point number between 0 (inclusive) and 1 (exclusive).
	// We multiply it by (max - min + 1) to expand the range.
	const randomFloat = Math.random() * (max - min + 1);

	// Math.floor() rounds the number down to the nearest whole number.
	// This gives us an integer from 0 to 7.
	const randomIntInRange = Math.floor(randomFloat);

	// We add the minimum value (min) to shift the range.
	// This changes the range from [0, 7] to [1, 8].
	const result = randomIntInRange + min;

	return result < 0 ? 1 : result;
}

let isInitialized = false;
// This function dynamically imports and registers the languages for highlight.js
export async function initializeHighlighter(hljs: HLJSApi) {
    // Run registration only once
    if (isInitialized) {
        return;
    }

    // Dynamically import all the language modules you need
    const [
        bash,
        css,
        dockerfile,
        go,
        javascript,
        php,
        python,
        sql,
        typescript,
        xml
    ] = await Promise.all([
        import('highlight.js/lib/languages/bash'),
        import('highlight.js/lib/languages/css'),
        import('highlight.js/lib/languages/dockerfile'),
        import('highlight.js/lib/languages/go'),
        import('highlight.js/lib/languages/javascript'),
        import('highlight.js/lib/languages/php'),
        import('highlight.js/lib/languages/python'),
        import('highlight.js/lib/languages/sql'),
        import('highlight.js/lib/languages/typescript'),
        import('highlight.js/lib/languages/xml')
    ]);

    // Register each language with its default export
    hljs.registerLanguage('bash', bash.default);
    hljs.registerLanguage('css', css.default);
    hljs.registerLanguage('dockerfile', dockerfile.default);
    hljs.registerLanguage('go', go.default);
    hljs.registerLanguage('javascript', javascript.default);
    hljs.registerLanguage('php', php.default);
    hljs.registerLanguage('python', python.default);
    hljs.registerLanguage('sql', sql.default);
    hljs.registerLanguage('typescript', typescript.default);
    hljs.registerLanguage('xml', xml.default);

    // Register convenient aliases
    hljs.registerAliases(['js', 'jsx', 'nodejs'], { languageName: 'javascript' });
    hljs.registerAliases(['html', 'vue', 'angular'], { languageName: 'xml' });
    hljs.registerAliases(['docker'], { languageName: 'dockerfile' });

    isInitialized = true;
}
