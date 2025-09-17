import { marked } from 'marked';

const FRONT_MATTER_REGEX = /^(?:\uFEFF)?---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]*/m;

marked.setOptions({
	breaks: true,
	gfm: true,
});

function stripFrontMatter(markdown: string): string {
	if (!markdown.trimStart().startsWith('---')) {
		return markdown;
	}

	const withoutFrontMatter = markdown.replace(FRONT_MATTER_REGEX, '');

	return withoutFrontMatter.replace(/^\s+/, '');
}

export function renderMarkdown(markdown?: string | null): string {
	if (!markdown) {
		return '';
	}

	const cleanedMarkdown = stripFrontMatter(markdown);

	return marked.parse(cleanedMarkdown);
}
