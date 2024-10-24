module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint', 'prettier'],
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended', // 确保这一行在最后
    ],
    rules: {
      // 你可以在这里自定义规则
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off', // 关闭多单词组件名称规则（可选）
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型（可选）
      // 其他自定义规则...
    },
  };
  