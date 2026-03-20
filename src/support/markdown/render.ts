import { marked } from 'marked';

// Match YAML front matter only at the very start (optional BOM supported)
const FRONT_MATTER_REGEX = /^\uFEFF?---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]*/;

marked.setOptions({
	breaks: true,
	gfm: true,
	async: false,
});

function stripFrontMatter(markdown: string): string {
	if (!FRONT_MATTER_REGEX.test(markdown)) {
		return markdown;
	}

	const withoutFrontMatter = markdown.replace(FRONT_MATTER_REGEX, '');

	return withoutFrontMatter.replace(/^[\r\n]+/, '');
}

function ensureString(result: string | Promise<string>): string {
	if (typeof result === 'string') {
		return result;
	}

	throw new Error('renderMarkdown expected a synchronous string result.');
}

export function renderMarkdown(markdown?: string | null): string {
	if (!markdown) {
		return '';
	}

	const cleanedMarkdown = stripFrontMatter(markdown);

	return ensureString(marked.parse(cleanedMarkdown));
}
