## Config

### 方法参数

| 事件名称          | 说明             | 类型     | 默认值 | 必传 |
| :---------------- | :--------------- | :------- | :----- | :--- |
| onPullDownRefresh | 下拉刷新触发函数 | function | -      | -    |
| onScrollToLower   | 上拉底触发函数   | function | -      | -    |

### 页面状态控制参数

| 属性              | 说明                                            | 类型              | 默认值                | 必传 |
| :---------------- | :---------------------------------------------- | :---------------- | :-------------------- | :--- |
| style             | -                                               | -                 | -                     | -    |
| lazy              | 开启懒加载(传入字符串为父元素 className 且开启) | boolean or string | false or '.lazy-view' | -    |
| hasMore           | 加载更多(！影响到是否能加载更多)                                        | boolean           | true                  | true |
| isEmpty           | 展示空凭页                                      | boolean           | -                     | -    |
| isError           | 展示错误页                                      | boolean           | -                     | -    |
| needInit          | 初始化&自动调用下拉刷新方法                     | boolean           | -                     | -    |
| distanceToRefresh | 下拉刷新距离                                    | number            | -                     | -    |
| damping           | 最大下拉距离                                    | number            | -                     | -    |
| autoHeight        | 开启自适应高度                                  | boolean           | -                     | -    |
| lazyStorage       | Storage Key值用于区分ListView                  | string            | box                   | -    |

### 自定义页面 UI（状态提示语，空白屏、错误屏、底部状态的 UI 自定义）

| 属性                | 说明                                                             | 类型      | 默认值                                                                                                  | 必传 |
| :------------------ | :--------------------------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------ | :--- |
| color               | 下拉加载时 loading 的颜色                                        | string    | #667baf                                                                                                 | -    |
| emptyText           | 空白页提示语                                                     | string    | -                                                                                                       | -    |
| footerLoaded        | 列表底部提示语                                                   | string    | -                                                                                                       |
| footerLoading       | 列表底部提示语                                                   | string    | 加载中                                                                                                  | -    |
| launch              | \*是否开启状态屏的渲染，状态屏节点对应以下 renderXX 属性（如下） | object    | `{ launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false }` | -    |
| renderError         | 错误页                                                           | Taro.Node | -                                                                                                       | -    |
| renderEmpty         | 空白页                                                           | Taro.Node | -                                                                                                       | -    |
| renderFooterLoaded  | 自定义底部加载完毕                                               | Taro.Node | -                                                                                                       | -    |
| renderFooterLoading | 自定义底部加载                                                   | Taro.Node | -                                                                                                       | -    |
| indicator           | 下拉提示语                                                       | Object    | `{ release = '加载中', activate = '下拉刷新', deactivate = '释放刷新'}`                                 | -    |

\*错误屏中重新初始化方法与下拉刷新方法一致

```jsx
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import ListView, { LazyBlock } from "taro-listview";

const blankList = [
  {
    author: {},
    title: "this is a example"
  },
  {
    author: {},
    title: "this is a example"
  },
  {
    author: {},
    title: "this is a example"
  },
  {
    author: {},
    title: "this is a example"
  }
];

let pageIndex = 1;

export default class Index extends Component {
  state = {
    isLoaded: false,
    error: false,
    hasMore: true,
    isEmpty: false,
    list: blankList
  };

  getData = async (pIndex = pageIndex) => {
    if (pIndex === 1) this.setState({ isLoaded: false });
    const {
      data: { data }
    } = await Taro.request({
      url: "https://cnodejs.org/api/v1/topics",
      data: {
        limit: 10,
        page: pIndex
      }
    });
    console.log({ data });
    return { list: data, hasMore: true, isLoaded: pIndex === 1 };
  };

  componentDidMount() {
    this.refList.fetchInit();
  }

  pullDownRefresh = async () => {
    pageIndex = 1;
    const res = await this.getData(1);
    this.setState(res);
  };

  onScrollToLower = async fn => {
    const { list } = this.state;
    const { list: newList, hasMore } = await this.getData(++pageIndex);
    this.setState({
      list: list.concat(newList),
      hasMore
    });
    fn();
  };

  refList = {};

  insRef = node => {
    this.refList = node;
  };

  render() {
    const { isLoaded, error, hasMore, isEmpty, list } = this.state;
    return (
      <View className="skeleton lazy-view">
        <ListView
          lazy
          ref={node => this.insRef(node)}
          isLoaded={isLoaded}
          isError={error}
          hasMore={hasMore}
          style={{ height: "100vh" }}
          isEmpty={isEmpty}
          onPullDownRefresh={this.pullDownRefresh}
          onScrollToLower={this.onScrollToLower}
          lazyStorage='lazyView'
        >
          {list.map((item, index) => {
            return (
              <View className="item skeleton-bg" key={index}>
                <LazyBlock current={index} className="avatar" lazyStorage='lazyView'>
                  <Image
                    className="avatar skeleton-radius"
                    src={item.author.avatar_url}
                  />
                </LazyBlock>
                <View className="title skeleton-rect">{item.title}</View>
              </View>
            );
          })}
        </ListView>
      </View>
    );
  }
}
```


```jsx
onPullDownRefresh = () => {
  getData();
};

onScrollToLower = async fn => {
  await getData();
  fn();
};
```
