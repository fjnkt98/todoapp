module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/no-unescaped-entities': 0,
    'react/jsx-uses-react': 0,
    'no-unused-var': 0,
    '@next/next/no-page-custom-font': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
