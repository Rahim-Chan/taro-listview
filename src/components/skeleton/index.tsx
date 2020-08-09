import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';

interface Props {
  isLoaded: boolean;
  selector?: string;
}

interface Item {
  width: string | number;
  height: string | number;
  top: string | number;
  left: string | number;
}

interface State {
  parentRect: Record<any, string>;
  bg: Item[];
  list: Item[];
  listRadius: Item[];
}

class Skeleton extends Component<Props, State> {
  static defaultProps = {
    isLoaded: false,
    selector: '.skeleton',
  };

  state = {
    parentRect: {},
    bg: [],
    list: [],
    listRadius: [],
  };

  componentDidMount() {
    if (Taro.getEnv() === 'WEAPP') {
      this.weappSkl();
    } else {
      this.h5Skl();
    }
  }

  h5Skl() {
    const selObj = {
      bg: '.skeleton-bg',
      list: '.skeleton-rect',
      listRadius: '.skeleton-radius',
    };
    const selAll = selector => {
      const list = [];
      document.querySelectorAll(selObj[selector]).forEach((i: any) => {
        // @ts-ignore
        list.push(i.getBoundingClientRect());
      });
      // @ts-ignore
      this.setState({
        [selector]: list,
      });
    };
    requestAnimationFrame(() => {
      const { selector = '.skeleton' } = this.props;
      const dom = document.querySelector(selector);
      if (dom) {
        const rect = dom.getBoundingClientRect();
        const parentStyle = {};
        Object.keys(rect).forEach(i => {
          parentStyle[i] = `${rect[i]}px`
        });
        this.setState({
          parentRect: parentStyle
        });
        selAll('bg');
        selAll('list');
        selAll('listRadius');
      }
    })
  }

  weappSkl() {
    const { selector } = this.props;
    Taro.createSelectorQuery()
      .in(Taro.Current.page)
      .selectAll(`.skeleton-bg`)
      .boundingClientRect()
      .exec(res => {
        console.log(res, 'resresres')
        this.setState({ bg: res[0] });
      });

    Taro.createSelectorQuery()
      .selectAll(`.skeleton-rect`)
      .boundingClientRect()
      .exec(res => {
        this.setState({ list: res[0] });
      });

    Taro.createSelectorQuery()
      .selectAll(`.skeleton-radius`)
      .boundingClientRect()
      .exec(res => {
        this.setState({ listRadius: res[0] });
      });
  }

  render() {
    const { list, bg, listRadius, parentRect } = this.state;
    const { isLoaded } = this.props; // 是否加载完成
    return (
      <View>
        <View style={{ opacity: isLoaded ? 1 : 0 }}>{this.props.children}</View>
        {isLoaded ? (
          ''
        ) : (
          <View style={{ ...parentRect, backgroundColor: 'white', position: 'fixed', overflow: 'hidden' }}>
            {bg.map(item => {
              const { width, height, top, left } = item as Item;
              return (
                <View
                  key={item}
                  style={{
                    background: 'white',
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}px`,
                    left: `${left}px`,
                    position: 'fixed',
                  }}
                />
              );
            })}
            {list.map(item => {
              const { width, height, top, left } = item as Item;
              return (
                <View
                  key={item}
                  className='skeletonBg'
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}px`,
                    left: `${left}px`,
                    position: 'fixed',
                  }}
                />
              );
            })}
            {listRadius.map(item => {
              const { width, height, top, left } = item as Item;
              return (
                <View
                  key={item}
                  className='skeletonBg'
                  style={{
                    borderRadius: '50%',
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}px`,
                    left: `${left}px`,
                    position: 'fixed',
                  }}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  }
}

export default Skeleton;
