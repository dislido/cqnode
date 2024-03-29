module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'no-confusing-arrow': 'off',
    'global-require': 'off',
    'max-len': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
    'no-promise-executor-return': 'off',
    'default-param-last': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'no-unused-vars': 'off',
    'prefer-spread': 'off',
    semi: 'off',
    indent: 'off',
    'arrow-parens': ['error', 'as-needed'],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-import-module-exports': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/no-unused-vars': ['error', {
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/default-param-last': ['error'],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/space-infix-ops': ['error'],
  },
};
