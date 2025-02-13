import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import boundaries from 'eslint-plugin-boundaries'
import typescriptParser from '@typescript-eslint/parser'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ languageOptions: { globals: globals.browser, parser: typescriptParser } },
	{ ignores: ['.vite/*'] },
	{
		plugins: {
			boundaries,
			'@typescript-eslint': typescriptEslintPlugin,
		},
		rules: { ...boundaries.configs.recommended.rules },
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryType: true,
				},
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{ ...pluginReact.configs.flat.recommended, rules: { 'react/react-in-jsx-scope': 0 } },
]
