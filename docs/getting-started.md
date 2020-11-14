---
nav:
  title: Getting Started
  order: 1
---

# Getting Started

## Installation
> 安装：`npm i taro-listview`，`yarn add taro-listview`

## Usage
```jsx
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import ListView, { LazyBlock } from "taro-listview";

const blankList = [{
    author: {},
    title: "this is a example"
  }];

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
      <View>
        <ListView
          ref={node => this.insRef(node)}
          isLoaded={isLoaded}
          isError={error}
          hasMore={hasMore}
          style={{ height: "100vh" }}
          isEmpty={isEmpty}
          onPullDownRefresh={this.pullDownRefresh}
          onScrollToLower={this.onScrollToLower}
        >
          {list.map((item, index) => {
            return (
              <View className="item" key={index}>
                <Image
                    className="avatar skeleton-radius"
                    src={item.author.avatar_url}
                  />
                <View className="title">{item.title}</View>
              </View>
            );
          })}
        </ListView>
      </View>
    );
  }
}
``` 

## Attention
If you find that the `ListView`'s interaction like pull-down or pull-on doesn't work in `MiNA`, please give it a fixed height.
Because it is a limitation from [scroll-view in MINA ](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html);

