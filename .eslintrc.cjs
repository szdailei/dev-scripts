module.exports = {
  ignorePatterns: ['dist'],
  parserOptions: {
    requireConfigFile: false,
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es2021: true,
    browser: true,
    node: true,
    serviceworker: true,
    jest: true,
  },
  settings: {},
  extends: ['airbnb', 'plugin:react-hooks/recommended', 'prettier'],
  rules: {
    'import/extensions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/function-component-definition': 'off',
  },
};
