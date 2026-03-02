module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
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
    // Отключаем все стилистические правила
    'semi': 'off',
    'quotes': 'off',
    'no-trailing-spaces': 'off',
    'indent': 'off',
    'comma-dangle': 'off',
    'eol-last': 'off',
    'brace-style': 'off',
    'arrow-parens': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: ['dist/**', 'node_modules/**', 'frontend/dist/**'],
}
