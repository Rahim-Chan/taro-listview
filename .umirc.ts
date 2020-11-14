import { defineConfig } from 'dumi';

export default defineConfig({
  resolve: {
    includes: ['docs'],
    previewLangs: [],
  },

  title: 'taro-listview',
  // mode: 'doc',
  theme: {
    '@c-primary': '#ff652f',
  },
  // more config: https://d.umijs.org/config
});
