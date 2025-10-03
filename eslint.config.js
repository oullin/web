// eslint.config.js
import pluginVue from 'eslint-plugin-vue';
import parserVue from 'vue-eslint-parser';
import parserTypeScript from '@typescript-eslint/parser';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserBabel from '@babel/eslint-parser';
import configPrettier from 'eslint-config-prettier';
import globals from 'globals';

const baseRecommendedConfig = {
	files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,vue}'],
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		globals: {
			...globals.browser,
			...globals.node,
		},
	},
	rules: {
		'constructor-super': 'error',
		'for-direction': 'error',
		'getter-return': 'error',
		'no-async-promise-executor': 'error',
		'no-await-in-loop': 'error',
		'no-class-assign': 'error',
		'no-compare-neg-zero': 'error',
		'no-cond-assign': 'error',
		'no-const-assign': 'error',
		'no-control-regex': 'error',
		'no-debugger': 'error',
		'no-dupe-args': 'error',
		'no-dupe-class-members': 'error',
		'no-dupe-keys': 'error',
		'no-duplicate-case': 'error',
		'no-empty': ['error', { allowEmptyCatch: true }],
		'no-empty-character-class': 'error',
		'no-empty-pattern': 'error',
		'no-ex-assign': 'error',
		'no-func-assign': 'error',
		'no-import-assign': 'error',
		'no-inner-declarations': 'error',
		'no-invalid-regexp': 'error',
		'no-irregular-whitespace': 'error',
		'no-loss-of-precision': 'error',
		'no-misleading-character-class': 'error',
		'no-obj-calls': 'error',
		'no-prototype-builtins': 'error',
		'no-regex-spaces': 'error',
		'no-self-assign': ['error', { props: true }],
		'no-setter-return': 'error',
		'no-shadow-restricted-names': 'error',
		'no-sparse-arrays': 'error',
		'no-this-before-super': 'error',
		'no-undef': 'error',
		'no-unexpected-multiline': 'error',
		'no-unreachable': 'error',
		'no-unsafe-finally': 'error',
		'no-unsafe-negation': 'error',
		'no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'no-useless-backreference': 'error',
		'require-yield': 'error',
		'use-isnan': 'error',
		'valid-typeof': ['error', { requireStringLiterals: true }],
	},
};

export default [
	{
		ignores: ['dist/', 'build/', 'node_modules/', '.git/', '.vscode/', '.idea/', '*.min.js', '*.css.map', 'public/', 'src/fonts/', 'src/images/'],
	},

	baseRecommendedConfig,

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

	// --- TypeScript Source Files (.ts, .tsx) ---
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: parserTypeScript,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json',
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': pluginTypeScript,
		},
		rules: {
			...pluginTypeScript.configs['recommended-type-checked'].rules,
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

	{
		files: ['src/partials/EducationPartial.vue', 'src/partials/RecommendationPartial.vue', 'src/pages/PostPage.vue'],
		rules: {
			'vue/no-v-html': 'off',
		},
	},

	// --- Prettier Integration (must be last) ---
	configPrettier,
];
