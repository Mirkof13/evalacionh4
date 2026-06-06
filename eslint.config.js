import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        ReactDOM: 'readonly',
        Icons: 'readonly',
        Shell: 'readonly',
        Bs: 'readonly',
        stockClass: 'readonly',
        Modal: 'readonly',
        ToastProvider: 'readonly',
        useToast: 'readonly',
        ProductForm: 'readonly',
        FarmabolStore: 'readonly',
        FARMABOL_TODAY: 'readonly',
        useStore: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-empty': 'warn',
      'no-undef': 'warn'
    }
  }
];
