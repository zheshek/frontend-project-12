export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      'frontend/dist/**',
      'dist/**',
      'node_modules/**',
      'build/**',
      '*.config.js'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Браузерные глобалы
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        // Node.js глобалы для конфигов
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
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
      'no-undef': 'off',
    },
  },
];
