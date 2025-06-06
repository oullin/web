// eslint.config.js
import js from '@eslint/js'; // Standard ESLint recommended rules
import pluginVue from 'eslint-plugin-vue'; // Vue plugin (needed for rule references)
import parserVue from 'vue-eslint-parser'; // Parser for .vue files
// Import TypeScript parser and plugin
import parserTypeScript from '@typescript-eslint/parser';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
// Import Babel parser (still needed for non-TS JS files if applicable)
import parserBabel from '@babel/eslint-parser'; // Parser for <script> block
import configPrettier from 'eslint-config-prettier'; // Disables conflicting rules

// Grab base globals from the recommended config (if any)
const baseGlobals = js.configs.recommended.languageOptions?.globals || {};

export default [
	// --- Global Ignores ---
	{
		ignores: ['dist/', 'build/', 'node_modules/', '.git/', '.vscode/', '.idea/', '*.min.js', '*.css.map', 'public/', 'src/fonts/', 'src/images/'],
	},

	// --- Apply Standard ESLint Recommended Rules ---
	js.configs.recommended,

	// --- Basic JS Files (.js, .mjs, .cjs) Configuration ---
	{
		files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
		languageOptions: {
			parser: parserBabel,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				requireConfigFile: false,
			},
			globals: {
				// inherit standard globals (browser, node, etc.)
				...baseGlobals,
				// explicitly add browser and build globals for JS files
				window: 'readonly',
				document: 'readonly',
				localStorage: 'readonly',
				process: 'readonly',
			},
		},
		rules: {
			// JS-specific overrides (if needed)
		},
	},

	// --- Vue Files (.vue) Configuration ---
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: parserVue, // mandatory for .vue files
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				parser: parserTypeScript,
				requireConfigFile: false,
				project: './tsconfig.json',
			},
			globals: {
				// inherit standard globals
				...baseGlobals,
				// browser/build globals
				window: 'readonly',
				document: 'readonly',
				localStorage: 'readonly',
				process: 'readonly',
				// Vue compiler macros
				defineProps: 'readonly',
				defineEmits: 'readonly',
				defineExpose: 'readonly',
				withDefaults: 'readonly',
			},
		},
		plugins: {
			vue: pluginVue,
			'@typescript-eslint': pluginTypeScript,
		},
		rules: {
			// Vue-specific rules
			'vue/no-unused-components': 'error',
			'vue/no-mutating-props': 'error',
			'vue/require-v-for-key': 'error',
			'vue/multi-word-component-names': 'error',
			'vue/no-setup-props-reactivity-loss': 'error',
			'vue/no-v-html': 'error',
			'vue/attributes-order': 'warn',
			'vue/order-in-components': 'warn',
			'vue/require-prop-types': 'warn',
			'vue/no-reserved-component-names': 'error',
		},
	},

	// --- Prettier Integration ---
	configPrettier,
];
