// eslint.config.js
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import parserVue from 'vue-eslint-parser';
import parserTypeScript from '@typescript-eslint/parser';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserBabel from '@babel/eslint-parser';
import configPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	{
		ignores: ['dist/', 'build/', 'node_modules/', '.git/', '.vscode/', '.idea/', '*.min.js', '*.css.map', 'public/', 'src/fonts/', 'src/images/'],
	},

	js.configs.recommended,

	// --- Config & Script Files (.js, .mjs, .cjs) ---
	{
		files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
		languageOptions: {
			parser: parserBabel,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				requireConfigFile: false, // Recommended for babel-parser
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},

	// --- Vue Component Files (.vue) ---
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: parserVue,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				parser: parserTypeScript,
				project: './tsconfig.json',
				extraFileExtensions: ['.vue'],
			},
			globals: {
				...globals.browser,
				// Vue 3 Compiler Macros
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

	// --- Prettier Integration (must be last) ---
	configPrettier,
];
