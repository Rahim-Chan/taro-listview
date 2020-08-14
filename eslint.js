"use strict";
module.exports = {
  root: true,
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    // 0 禁用，1 警告，2 错误
    /* TypeScript 相关：https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin */
    // 不推荐使用此规则，而使用 naming-convention
    "@typescript-eslint/camelcase": 0,
    // class 的方法必须声明 public/private，constructors 除外
    "@typescript-eslint/explicit-member-accessibility": 0,
    // 缩进固定为两个空格
    "@typescript-eslint/indent": 0,
    /** React Hooks Style Guide https://reactjs.org/docs/hooks-rules.html */
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": 0,
    /** 无障碍相关 https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules */
    // label htmlFor 属性或者用 label 把表单组件包起来
    "jsx-a11y/label-has-associated-control": 1,
    // 静态元素（div/span/...）不允许绑定事件，除非指定 role
    "jsx-a11y/no-static-element-interactions": 0,
    // 静态元素（div/span/...）不允许绑定事件，除非指定 role
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    // 支持 click 事件必须同时支持键盘事件
    "jsx-a11y/click-events-have-key-events": 0,
    // 禁止不规则使用 a 标签
    "jsx-a11y/anchor-is-valid": 0,
    // require that JSX labels use "htmlFor"
    "jsx-a11y/label-has-for": 1,
    /** react相关 https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules */
    // index 不能作为 key
    "react/no-array-index-key": 1,
    // 每行只能有一个 jsx 组件声明
    "react/jsx-one-expression-per-line": 0,
    // 必须声明 propTypes
    "react/prop-types": 0,
    // 使用 props/state/context 必须解构
    "react/destructuring-assignment": 0,
    // 禁止不具体的 propTypes 声明
    "react/forbid-prop-types": 0,
    // 禁止 JSX 文件后缀为非 .jsx
    "react/jsx-filename-extension": 0,
    // ...props
    "react/jsx-props-no-spreading": 0,
    /** import/export相关 https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules */
    // 必须写明文件类型：取消
    "import/extensions": 0,
    // 路径必须可以被本地文件系统解析：取消
    "import/no-unresolved": 0,
    // 只能引用package.json声明的依赖：取消 TBD
    "import/no-extraneous-dependencies": 0,
    // 优先使用 export default: 取消
    "import/prefer-default-export": 0,
    /** 基础语法规则 https://eslint.org/docs/rules/ */
    // 禁止 console.log
    "no-console": 0,
    // 禁止对函数参数进行重新赋值
    "no-param-reassign": 1,
    // 禁止使用全局使用 require 函数
    "global-require": 0
//    "no-unused-vars": ["error", { "varsIgnorePattern": "Taro" }],
//    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }]
  },
  "settings": {
    // support import modules from TypeScript files in JavaScript files
    "import/resolver": {
      node: { extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"] },
    }
  },
  "plugins": [
    "@typescript-eslint",
    "react",
//    "taro",
    "react-hooks"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "useJSXTextNode": true,
    "project": "./tsconfig.json"
  }
}
