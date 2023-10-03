module.exports = {
  parser: '@typescript-eslint/parser', // Specifies ESLint parser
  extends: ['plugin:@typescript-eslint/recommended', 'standard-with-typescript', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest', // Allows parsing of modern ECMA features
    sourceType: 'module', // Allows for the use of imports
    project: 'tsconfig.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
	'@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 0,
    '@typescript-eslint/no-extraneous-class': 0,
    '@typescript-eslint/no-invalid-void-type': 0,
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 140,
        semi: false,
        useTabs: false,
        tabWidth: 2,
        trailingComma: 'none',
        singleQuote: true
      }
    ]
  }
}
