const IMAGES_DIR = 'images';

export function image(filename: string): string {
	return `/${IMAGES_DIR}/${filename}`;
}

export function date(language?: string, options?: object): Intl.DateTimeFormat  {
	const lang = language || "en-US";

	const ops = options || {
		year:  "numeric",
		month: "long",
		day:   "numeric"
	}

	return new Intl.DateTimeFormat(lang, ops)
}
