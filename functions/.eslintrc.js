module.exports = {
	root: true,
	env: {
		es6: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'google'
	],
	parserOptions: {
		ecmaVersion: 9
	},
	rules: {
		'quotes': ['error', 'single'],
		'indent': ['error', 'tab'],
		'comma-dangle': ['error', 'never'],
		'no-tabs': ['error', {allowIndentationTabs: true}],
		'require-jsdoc': 0,
		'max-len': ['error', {'code': 120}],
		'no-unused-vars': 0
	}
};
