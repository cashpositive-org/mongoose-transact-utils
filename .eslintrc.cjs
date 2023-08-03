// noinspection JSUnresolvedVariable
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // make sure this is always the last configuration in the extends array.
    'plugin:prettier/recommended', // display prettier errors as ESLint errors.
  ],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: ['/*.*', '/**/__test__/*', 'lib/', 'config/'],
  rules: {
    // 'no-console': 2,
    // 'max-classes-per-file': ['error', 1]
  },
};
