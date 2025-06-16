import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: [
            '**/dist/**/*',
            'docs/.vitepress/cache/**/*',
            '**/reports/**/*',
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    stylistic.configs.customize({
        indent: 4,
        semi: true,
        braceStyle: '1tbs',
    }),
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.mocha,
            },
        },
        rules: {
            'array-callback-return': 'error',
            'eqeqeq': 'error',
            'no-var': 'error',
            'prefer-const': ['error', { destructuring: 'all' }],
            '@stylistic/operator-linebreak': 'off',
            '@stylistic/max-statements-per-line': ['error', { max: 1, ignoredNodes: ['BreakStatement'] }],
            '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
            '@typescript-eslint/ban-ts-comment': 'off',
            "@typescript-eslint/class-literal-property-style": 'off',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
    {
        files: ['**/*.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
];
