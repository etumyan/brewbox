module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // sorted alphabetically
    'array-bracket-spacing': ['error'],
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'no-debugger': ['error'],
    'no-eval': ['error'],
    'no-trailing-spaces': ['error'],
    'no-unused-vars': 'off',
    'no-var': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': ['error'],
    'quotes': ['error', 'single'],
  },
};
