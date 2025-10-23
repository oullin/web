import { describe, expect, it, vi } from 'vitest';
import { ensureCodeBlockClasses, initializeHighlighter, renderMarkdown } from '@/support/markdown.ts';

const SAMPLE_WITH_FRONT_MATTER = `---\ntitle: Example Title\nexcerpt: Example excerpt\nslug: example-slug\n---\n\n![hero](https://example.com/hero.jpg)\n\n## Heading\n\n- Item one\n- Item two\n\n| Col A | Col B |\n| ----- | ----- |\n| A     | B     |\n`;

const EXPECTED_LANGUAGE_REGISTRATIONS = [
	'bash',
	'css',
	'dockerfile',
	'go',
	'javascript',
	'json',
	'makefile',
	'nginx',
	'php',
	'plaintext',
	'python',
	'sql',
	'typescript',
	'xml',
	'yaml',
	'curl',
	'shell',
	'sh',
	'zsh',
	'yml',
];

const EXPECTED_ALIAS_REGISTRATIONS: Array<[string[], { languageName: string }]> = [
	[['js', 'jsx', 'nodejs'], { languageName: 'javascript' }],
	[['html', 'vue', 'angular'], { languageName: 'xml' }],
	[['docker'], { languageName: 'dockerfile' }],
	[['curl', 'Curl', 'CURL'], { languageName: 'bash' }],
	[['sh', 'shell', 'zsh'], { languageName: 'bash' }],
	[['yml'], { languageName: 'yaml' }],
	[['Text', 'TXT'], { languageName: 'plaintext' }],
	[['TS'], { languageName: 'typescript' }],
];

describe('renderMarkdown', () => {
	it('returns an empty string when markdown is missing', () => {
		expect(renderMarkdown(undefined)).toBe('');
		expect(renderMarkdown(null)).toBe('');
	});

	it('strips YAML front matter before rendering markdown', () => {
		const html = renderMarkdown(SAMPLE_WITH_FRONT_MATTER);

		expect(html).not.toContain('Example Title');
		expect(html).toContain('<h2>Heading</h2>');
		expect(html).toContain('<ul>');
		expect(html).toContain('<table>');
	});

	it('renders markdown without front matter unchanged', () => {
		const html = renderMarkdown('## Just Heading');

		expect(html).toContain('<h2>Just Heading</h2>');
	});

	it('adds a light-background class to fenced code blocks', () => {
		const html = renderMarkdown('```yml\nfoo: bar\n```');

		expect(html).toContain('<pre class=\'code-block code-block--light\'><code class="language-yml">');
	});

	it('sanitizes rendered HTML output', () => {
		const html = renderMarkdown('<img src="x" onerror="alert(1)">');

		expect(html).toBe('<p><img src="x"></p>\n');
	});

	it('merges code block classes with existing pre tag classes', () => {
		const html = ensureCodeBlockClasses('<pre class="existing" data-demo="true"><code>example</code></pre>');

		expect(html).toBe('<pre class="existing code-block code-block--light" data-demo="true"><code>example</code></pre>');
	});
});

describe('initializeHighlighter', () => {
	it('registers languages and aliases once per highlighter core', async () => {
		const registerLanguage = vi.fn();
		const registerAliases = vi.fn();

		const hljs = {
			registerLanguage,
			registerAliases,
		} as unknown as import('highlight.js').HLJSApi;

		await initializeHighlighter(hljs);

		expect(registerLanguage.mock.calls.map(([name]) => name)).toEqual(EXPECTED_LANGUAGE_REGISTRATIONS);

		expect(registerAliases.mock.calls).toEqual(EXPECTED_ALIAS_REGISTRATIONS);

		await initializeHighlighter(hljs);

		expect(registerLanguage).toHaveBeenCalledTimes(EXPECTED_LANGUAGE_REGISTRATIONS.length);
		expect(registerAliases).toHaveBeenCalledTimes(EXPECTED_ALIAS_REGISTRATIONS.length);

		const secondRegisterLanguage = vi.fn();
		const secondRegisterAliases = vi.fn();

		const secondHljs = {
			registerLanguage: secondRegisterLanguage,
			registerAliases: secondRegisterAliases,
		} as unknown as import('highlight.js').HLJSApi;

		await initializeHighlighter(secondHljs);

		expect(secondRegisterLanguage.mock.calls.map(([name]) => name)).toEqual(EXPECTED_LANGUAGE_REGISTRATIONS);

		expect(secondRegisterAliases.mock.calls).toEqual(EXPECTED_ALIAS_REGISTRATIONS);
	});
});
