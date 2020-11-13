import path from 'path';
import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'Taro-listview',
  mode: 'doc',
  logo: 'https://oss.lai-ai.com/szla-logo.png',
  hash: true,
  resolve: {
    includes: ['docs'],
  },
});
