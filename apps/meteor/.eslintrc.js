module.exports = {
	extends: ['@rocket.chat/eslint-config'],
	parserOptions: {
		sourceType: 'module',
		allowImportExportEverywhere: false,
		ecmaFeatures: {
			globalReturn: false,
		},
		babelOptions: {
			configFile: require('path').join(__dirname, './.babelrc'),
		},
	},
	globals: {
		__meteor_bootstrap__: false,
		__meteor_runtime_config__: false,
		Assets: false,
		chrome: false,
		jscolor: false,
	},
	plugins: ['react', 'react-hooks'],
	rules: {
		'react/jsx-uses-react': 'error',
		'react/jsx-uses-vars': 'error',
		'react/jsx-no-undef': 'error',
		'react/jsx-fragments': ['error', 'syntax'],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': [
			'warn',
			{
				additionalHooks: '(useComponentDidUpdate)',
			},
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			globals: {
				Atomics: 'readonly',
				SharedArrayBuffer: 'readonly',
			},
			plugins: ['react'],
			rules: {
				'@typescript-eslint/ban-ts-comment': 'warn',
				'@typescript-eslint/ban-types': 'warn',
				'@typescript-eslint/no-redeclare': 'error',
				'no-redeclare': 'off',
				'no-undef': 'off',
				'react/jsx-uses-react': 'error',
				'react/jsx-uses-vars': 'error',
				'react/jsx-no-undef': 'error',
				'react/jsx-fragments': ['error', 'syntax'],
			},
			settings: {
				react: {
					version: 'detect',
				},
			},
		},
		{
			files: ['**/*.tests.js', '**/*.tests.ts', '**/*.spec.ts'],
			env: {
				mocha: true,
			},
		},
	],
};
