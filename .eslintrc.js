module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember/base'
  ],
  env: {
    browser: true
  },
  rules: {
    'ember/alias-model-in-controller': 'off',
    'no-console': 'off'
  }
};
