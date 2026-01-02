// eslint.config.ts
import pluginVue from 'eslint-plugin-vue';
import parserVue from 'vue-eslint-parser';
import parserTypeScript from '@typescript-eslint/parser';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import configPrettier from 'eslint-config-prettier';
import globals from 'globals';

const baseRecommendedConfig = {
	files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,vue}'],
	languageOptions: {
		ecmaVersion: 'latest' as const,
		sourceType: 'module' as const,
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
		'no-await-in-loop': 'warn',
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
		'no-undef': 'warn',
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

	// --- JavaScript Files (.js, .mjs, .cjs) - Uses ESLint's default parser (espree) ---
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		languageOptions: {
			ecmaVersion: 'latest' as const,
			sourceType: 'module' as const,
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
			...pluginTypeScript.configs.recommended.rules,
			'no-unused-vars': 'off',
			'no-undef': 'off',
			'no-await-in-loop': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/unbound-method': 'off',
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
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},

	{
		files: ['src/partials/ArticleItemPartial.vue', 'src/partials/EducationPartial.vue', 'src/partials/RecommendationPartial.vue', 'src/pages/PostPage.vue', 'src/partials/ExperiencePartial.vue'],
		rules: {
			'vue/no-v-html': 'off',
		},
	},

	// --- Prettier Integration (must be last) ---
	configPrettier,
];
