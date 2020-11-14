### Skeleton

1.因骨架屏是捕捉已有占位数据的样式，再绘制出骨架，所以要先注入默认空白占位数据。

2.且需要一个传入父元素的 className(默认获取为“skeleton”），以便寻找元素下的所有“关节”元素。可通过传入 selector 参数自定义 className。

    有且只有捕捉以下提供的“关节”样式名：背景（'skeleton-bg'）、矩阵（'skeleton-rect'）、圆形（'skeleton-redius'）。

3.ListView 组件已嵌套 Skeleton 组件，直接调用对应属性即可。

\*“关节”元素需内容撑开，或者固定高度。

#### API

##### Skeleton

| 属性     | 说明                                  | 类型     | 默认值 | 必传 |
| :------- | :------------------------------------ | :------- | :----- | :--- |
| isLoaded | 骨架屏是否显示（eg:加载第一页时开启） | boolean  | false  | -    |
| selector | 骨架屏外层 class 名称                 | skeleton | -      | -    |

[骨架屏 Demo](https://github.com/Rahim-Chan/taro-listview/blob/master/src/pages/skeleton/index.tsx)

```jsx
import Taro, { useState } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { Skeleton } from "components";
import "./index.scss";

export default () => {
  const [isLoaded, setLoaded] = useState(false);
  return (
    <View>
      <Button onClick={() => setLoaded(!isLoaded)}>toggle</Button>
      <View className="skeleton">
        <Skeleton isLoaded={isLoaded}>
          {Array(4)
            .fill(1)
            .map(i => (
              <View className="item skeleton-bg" key={i}>
                <View className="avatar skeleton-radius" />
                <View className="title skeleton-rect">title</View>
              </View>
            ))}
        </Skeleton>
      </View>
    </View>
  );
};
```
