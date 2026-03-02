module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    // Стандартные правила ESLint
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    'arrow-parens': ['error', 'as-needed'],
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: ['dist/**', 'node_modules/**', 'frontend/dist/**'],
}
