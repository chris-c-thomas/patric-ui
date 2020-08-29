module.exports = {
  'env': {
    'node': true,
    'es2020': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
    'enforceDynamicLinks': 'never'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': ['error', 2],
    'linebreak-style': ['error','unix'],
    'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
    'semi': ['error', 'never']
  },
  'globals': {
    'document': true,
    'alert': true
  }
}
