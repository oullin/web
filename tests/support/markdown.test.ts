import { describe, expect, it } from 'vitest';
import { renderMarkdown } from '@/support/markdown.ts';

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
