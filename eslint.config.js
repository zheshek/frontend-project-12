export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
    rules: {
      // Отключаем все стилистические правила
      '@stylistic/semi': 'off',
      '@stylistic/quotes': 'off',
      '@stylistic/no-trailing-spaces': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/eol-last': 'off',
      '@stylistic/brace-style': 'off',
      '@stylistic/arrow-parens': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/jsx-wrap-multilines': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/jsx-curly-newline': 'off',
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/jsx-closing-tag-location': 'off',
      '@stylistic/no-multiple-empty-lines': 'off',
      '@stylistic/no-multi-spaces': 'off',
      '@stylistic/quote-props': 'off',
      // Оставляем только важные правила
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
];
