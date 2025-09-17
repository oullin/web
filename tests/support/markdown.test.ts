import { describe, expect, it, vi } from 'vitest';
import { initializeHighlighter, renderMarkdown } from '@/support/markdown.ts';

const SAMPLE_WITH_FRONT_MATTER = `---\ntitle: Example Title\nexcerpt: Example excerpt\nslug: example-slug\n---\n\n![hero](https://example.com/hero.jpg)\n\n## Heading\n\n- Item one\n- Item two\n\n| Col A | Col B |\n| ----- | ----- |\n| A     | B     |\n`;

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
        it('registers languages and aliases exactly once', async () => {
                const registerLanguage = vi.fn();
                const registerAliases = vi.fn();

                const hljs = {
                        registerLanguage,
                        registerAliases,
                } as unknown as import('highlight.js').HLJSApi;

                await initializeHighlighter(hljs);

                expect(registerLanguage.mock.calls.map(([name]) => name)).toEqual([
                        'bash',
                        'css',
                        'dockerfile',
                        'go',
                        'javascript',
                        'php',
                        'python',
                        'sql',
                        'typescript',
                        'xml',
                        'yaml',
                        'shell',
                        'sh',
                        'zsh',
                        'yml',
                ]);

                expect(registerAliases.mock.calls).toEqual([
                        [['js', 'jsx', 'nodejs'], { languageName: 'javascript' }],
                        [['html', 'vue', 'angular'], { languageName: 'xml' }],
                        [['docker'], { languageName: 'dockerfile' }],
                        [['sh', 'shell', 'zsh'], { languageName: 'bash' }],
                        [['yml'], { languageName: 'yaml' }],
                ]);

                await initializeHighlighter(hljs);

                expect(registerLanguage).toHaveBeenCalledTimes(15);
                expect(registerAliases).toHaveBeenCalledTimes(5);
        });
});
