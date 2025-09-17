import type { HLJSApi, LanguageFn } from 'highlight.js';
import { marked } from 'marked';

// Match YAML front matter only at the very start (optional BOM supported)
const FRONT_MATTER_REGEX = /^\uFEFF?---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]*/;
type LanguageModule = { default: LanguageFn };

const LANGUAGE_LOADERS: ReadonlyArray<readonly [string, () => Promise<LanguageModule>]> = [
        ['bash', () => import('highlight.js/lib/languages/bash')],
        ['css', () => import('highlight.js/lib/languages/css')],
        ['curl', () => import('highlight.js/lib/languages/curl')],
        ['dockerfile', () => import('highlight.js/lib/languages/dockerfile')],
        ['go', () => import('highlight.js/lib/languages/go')],
        ['javascript', () => import('highlight.js/lib/languages/javascript')],
        ['json', () => import('highlight.js/lib/languages/json')],
        ['makefile', () => import('highlight.js/lib/languages/makefile')],
        ['nginx', () => import('highlight.js/lib/languages/nginx')],
        ['php', () => import('highlight.js/lib/languages/php')],
        ['plaintext', () => import('highlight.js/lib/languages/plaintext')],
        ['python', () => import('highlight.js/lib/languages/python')],
        ['sql', () => import('highlight.js/lib/languages/sql')],
        ['typescript', () => import('highlight.js/lib/languages/typescript')],
        ['xml', () => import('highlight.js/lib/languages/xml')],
        ['yaml', () => import('highlight.js/lib/languages/yaml')],
];

const LANGUAGE_ALIASES: ReadonlyArray<[string[], string]> = [
        [['js', 'jsx', 'nodejs'], 'javascript'],
        [['html', 'vue', 'angular'], 'xml'],
        [['docker'], 'dockerfile'],
        [['sh', 'shell', 'zsh'], 'bash'],
        [['yml'], 'yaml'],
        [['Curl'], 'curl'],
        [['Go', 'GO'], 'go'],
        [['JSON'], 'json'],
        [['Makefile'], 'makefile'],
        [['Nginx'], 'nginx'],
        [['PHP'], 'php'],
        [['Plaintext', 'Text', 'TXT'], 'plaintext'],
        [['SQL'], 'sql'],
        [['Python'], 'python'],
        [['TypeScript', 'TS'], 'typescript'],
];

const LANGUAGE_FALLBACK_REGISTRATIONS: ReadonlyArray<readonly [string, string]> = [
	['shell', 'bash'],
	['sh', 'bash'],
	['zsh', 'bash'],
	['yml', 'yaml'],
];

const initializedCores = new WeakSet<object>();

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
	// Remove any leading blank space left by front‑matter removal
	return withoutFrontMatter.replace(/^\s+/, '');
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

export async function initializeHighlighter(hljs: HLJSApi): Promise<void> {
	const coreObj = hljs as unknown as object;
	if (initializedCores.has(coreObj)) {
		return;
	}

	initializedCores.add(coreObj);

	const modules = await Promise.all(LANGUAGE_LOADERS.map(([, loader]) => loader()));

	const registeredLanguages = new Map<string, LanguageFn>();

	modules.forEach((module, index) => {
		const [language] = LANGUAGE_LOADERS[index];

		// highlight.js language modules default-export the registration function
		registeredLanguages.set(language, module.default);
		hljs.registerLanguage(language, module.default);
	});

	LANGUAGE_FALLBACK_REGISTRATIONS.forEach(([alias, canonical]) => {
		const language = registeredLanguages.get(canonical);
		if (language) {
			hljs.registerLanguage(alias, language);
		}
	});

	LANGUAGE_ALIASES.forEach(([aliases, languageName]) => {
		hljs.registerAliases(aliases, { languageName });
	});
}
