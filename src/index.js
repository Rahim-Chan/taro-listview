import Taro  from '@tarojs/taro'

import ListView from './components/list-view/index';

Taro.initPxTransform({ designWidth: 750 });

export { default as Skeleton } from './components/skeleton/index';
export default ListView;
