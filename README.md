# taro-listview

## 安装方式

> 安装：`npm i taro-listview`， `yarn add taro-listview`


## *注意*

> *由于该组件库还未开发完成，后期 API 可能会变动，请慎用在商业环境！*


## 使用案例

### 引入组件
需给组件设置固定高度

```jsx
import ListView from 'taro-listview'

onPullDownRefresh = async (rest) => {
    const res = await fetch(1);// { list: array, hasMore: boolean }
    this.setState(res);
    rest()
  };

onScrollToLower = async (fn) => {
  const { list } = this.state;
  const { list: newList, ...rest } = await fetch(++pageIndex);
  this.setState({
    list: list.concat(newList),
    ...rest,
  });
  fn();
};

const { hasMore, list } = this.state;
// 组件一定要设置高度
<ListView
  hasMore={hasMore}
  style={{ height: '100vh' }}
  onScrollToLower={fn => this.onScrollToLower(fn)}
>
  {
    list.map((item, index) => (
      <View key={index}>
        <Image className='avatar skeleton-radius' src={item.avatar}/>
        <View>
          { item.title }
        </View>
        <View>
          { item.value }
        </View>
      </View>
    ))
  }
</ListView>
```
## 可配置参数
### 页面状态控制参数
| 属性 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| style   | -    | - | - | - |
| hasMore   | 允许加载更多    | boolean | true |true |
| isEmpty   | 空凭页    | boolean | - | - |
| isError   | 错误页    | boolean | - | - |
| needInit   | 初始化&自动调用下拉刷新方法   | boolean | - | - |
| distanceToRefresh   | 下拉距离    | boolean | - | - |
| emptyText   | 空白页提示语    | string | - | - |


### 自定义UI
| 属性 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| emptyText   | 空白页提示语    | boolean | - | - |
| footerLoaded   | 暂无更多信息提示语    | string | 暂无更多内容 | - |
| footerLoading   | 加载更多信息提示语    | string | 加载中 | - |
| launch   | 开启自定义页面 *开启时需传入对应render属性 | object | ```{ launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false }```  |- | 
| renderEmpty   | 空白页    | boolean | - | - |
| renderError   | 错误页    | boolean | - | - |
| renderFooterLoading   | 自定义底部加载    | boolean | - | - |
| renderFooterLoaded   | 自定义底部加载完毕    | boolean | - | - |
| indicator   | 下拉提示语    | boolean | ```{ release = '加载中', activate = '下拉刷新', deactivate = '释放刷新'}``` | - |

### 骨架屏
1.因骨架屏是捕捉已有占位数据的样式，再绘制出骨架，所以要先注入默认空白占位数据。
2.且需要一个传入父元素的class名(默认获取class为：skeleton的元素下的所有元素，可通过传入selector参数自定义class名。)，以捕捉子元素。现提供骨架选择器：背景（'skeleton-bg'）、矩阵（'skeleton-rect'）、圆形（'skeleton-redius'）。
```jsx
<View className='skeleton>
  <ListView>
    <View className='item skeleton-bg' >
      <Image className='avatar skeleton-radius' src={item.avatar}/>
      <View className='title skeleton-rect'>
        title
      </View>
      <View className='skeleton-rect'>
        value
      </View>
    </View>
  </ListView>
</View>
```

| 属性 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| isLoaded   | 骨架屏是否显示（eg:加载第一页时开启）    | boolean | false | - |
| selector   | 骨架屏外层class名称    | string | - | - |


### 方法参数

| 事件名称 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| onPullDownRefresh   | 下拉刷新触发函数 | function | - | - |
| onScrollToLower   | 上拉底触发函数    | function | - | - |

```jsx
onPullDownRefresh = async (rest) => {
  await getData()
  rest()
}

onScrollToLower = async (fn) => {
  await getData()
  fn()
};

```
# taro-listview

## 安装方式

> 安装：`npm i taro-listview`， `yarn add taro-listview`


## *注意*

> *由于该组件库还未开发完成，后期 API 可能会变动，请慎用在商业环境！*


## 使用案例

### 引入组件
需给组件设置固定高度

```jsx
import ListView from 'taro-listview'

onPullDownRefresh = async (rest) => {
    const res = await fetch(1);// { list: array, hasMore: boolean }
    this.setState(res);
    rest()
  };

onScrollToLower = async (fn) => {
  const { list } = this.state;
  const { list: newList, ...rest } = await fetch(++pageIndex);
  this.setState({
    list: list.concat(newList),
    ...rest,
  });
  fn();
};

const { hasMore, list } = this.state;
// 组件一定要设置高度
<ListView
  hasMore={hasMore}
  style={{ height: '100vh' }}
  onScrollToLower={fn => this.onScrollToLower(fn)}
>
  {
    list.map((item, index) => (
      <View key={index}>
        <Image className='avatar skeleton-radius' src={item.avatar}/>
        <View>
          { item.title }
        </View>
        <View>
          { item.value }
        </View>
      </View>
    ))
  }
</ListView>
```
## 可配置参数
### 页面状态控制参数
| 属性 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| style   | -    | - | - | - |
| hasMore   | 允许加载更多    | boolean | true |true |
| isEmpty   | 空凭页    | boolean | - | - |
| isError   | 错误页    | boolean | - | - |
| needInit   | 初始化&自动调用下拉刷新方法   | boolean | - | - |
| distanceToRefresh   | 下拉距离    | boolean | - | - |
| emptyText   | 空白页提示语    | string | - | - |


### 自定义UI
| 属性 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| emptyText   | 空白页提示语    | boolean | - | - |
| footerLoaded   | 暂无更多信息提示语    | string | 暂无更多内容 | - |
| footerLoading   | 加载更多信息提示语    | string | 加载中 | - |
| launch   | 开启自定义页面 *开启时需传入对应render属性 | object | ```{ launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false }```  |- | 
| renderEmpty   | 空白页    | boolean | - | - |
| renderError   | 错误页    | boolean | - | - |
| renderFooterLoading   | 自定义底部加载    | boolean | - | - |
| renderFooterLoaded   | 自定义底部加载完毕    | boolean | - | - |
| indicator   | 下拉提示语    | boolean | ```{ release = '加载中', activate = '下拉刷新', deactivate = '释放刷新'}``` | - |

### 骨架屏
1.因骨架屏是捕捉已有占位数据的样式，再绘制出骨架，所以要先注入默认空白占位数据。
2.且需要一个传入父元素的class名(默认获取class为：skeleton的元素下的所有元素，可通过传入selector参数自定义class名。)，以捕捉子元素。现提供骨架选择器：背景（'skeleton-bg'）、矩阵（'skeleton-rect'）、圆形（'skeleton-redius'）。
```jsx
<View className='skeleton>
  <ListView>
    <View className='item skeleton-bg' >
      <Image className='avatar skeleton-radius' src={item.avatar}/>
      <View className='title skeleton-rect'>
        title
      </View>
      <View className='skeleton-rect'>
        value
      </View>
    </View>
  </ListView>
</View>
```

| 属性 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| isLoaded   | 骨架屏是否显示（eg:加载第一页时开启）    | boolean | false | - |
| selector   | 骨架屏外层class名称    | string | - | - |


### 方法参数

| 事件名称 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| onPullDownRefresh   | 下拉刷新触发函数 | function | - | - |
| onScrollToLower   | 上拉底触发函数    | function | - | - |

```jsx
onPullDownRefresh = async (rest) => {
  await getData()
  rest()
}

onScrollToLower = async (fn) => {
  await getData()
  fn()
};

```
