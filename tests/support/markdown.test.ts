import { describe, expect, it, vi } from 'vitest';
import { initializeHighlighter, renderMarkdown } from '@/support/markdown.ts';

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
	[['sh', 'shell', 'zsh'], { languageName: 'bash' }],
	[['yml'], { languageName: 'yaml' }],
	[['Curl'], { languageName: 'curl' }],
	[['Go', 'GO'], { languageName: 'go' }],
	[['JSON'], { languageName: 'json' }],
	[['Makefile'], { languageName: 'makefile' }],
	[['Nginx'], { languageName: 'nginx' }],
	[['PHP'], { languageName: 'php' }],
	[['Plaintext', 'Text', 'TXT'], { languageName: 'plaintext' }],
	[['SQL'], { languageName: 'sql' }],
	[['Python'], { languageName: 'python' }],
	[['TypeScript', 'TS'], { languageName: 'typescript' }],
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
