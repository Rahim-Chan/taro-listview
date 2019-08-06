import Taro, {Component} from '@tarojs/taro';
import {ScrollView, View } from '@tarojs/components';
import { ITouchEvent } from '@tarojs/components/types/common';
import Skeleton from '../skeleton';
import {throttle} from '../../utils/utils';
import ResultPage from '../result-page';
import './index.scss';

interface Props {
  style?: any;
  className?: string;
  emptyText?: string;
  footerLoadedText?: string;
  footerLoadingText?: string;
  noMore?: string;
  tipText?: string;
  tipFreedText?: string;
  onScrollToLower: (any) => void;
  onPullDownRefresh?: (any) => void;
  hasMore: boolean;
  needInit?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
  launch?: Launch;
  renderEmpty?: JSX.Element;
  renderError?: JSX.Element;
  renderFooterLoading?: any;
  renderFooterLoaded?: any;
  damping?: number;
  distanceToRefresh?: number;
  indicator?: Indicator;
  isLoaded?: boolean;
  selector?: string;
}

interface Indicator {
  activate?: any,
  deactivate?: any,
  release?: any,
  tipFreedText?: any;
}

interface Launch {
  launchEmpty?: boolean;
  launchError?: boolean;
  launchFooterLoading?: boolean;
  launchFooterLoaded?: boolean;
}

const initialState = {
  canScrollY: true,
  touchScrollTop: 0,
  scrollTop: 0,
  startY: 0,
  downLoading: false,
  lowerLoading: false,
  needPullDown: true,
  isInit: false,
  blockStyle: {
    transform: 'translate3d(0,0,0)',
    transition: 'none',
  },
};

type State = Readonly<typeof initialState>

class ListView extends Component<Props, State> {
  static options = {
    addGlobalClass: true,
  };

  static defaultProps = {
    distanceToRefresh: 30,
    damping: 100,
    isLoaded: true,
    isEmpty: false,
    emptyText: '',
    noMore: '暂无更多内容',
    footerLoadingText: '加载中...',
    footerLoadedText: '暂无更多内容',
    scrollTop: 0,
    touchScrollTop: 0,
    onScrollToLower: () => {
    },
    onPullDownRefresh: null,
    hasMore: false,
    needInit: false,
    isError: false,
    launch: {},
    renderEmpty: <View />,
    renderError: <View />,
    indicator: {}
  };

  scrollView = {};

  static state = {
    canScrollY: true,
    touchScrollTop: 0,
    scrollTop: 0,
    startY: 0,
    downLoading: false,
    lowerLoading: false,
    needPullDown: true,
    isInit: false,
    blockStyle: {
      height: `${0}px`,
      transition: `none`,
    },
  };

  componentDidMount() {
    if (this.props.needInit) this.fetchInit();
  }

  touchEvent = (e: ITouchEvent) => {
    const {startY} = this.state;
    const {type, touches} = e;
    const {onPullDownRefresh, damping ,distanceToRefresh} = this.props;
    if (!onPullDownRefresh) return;
    switch (type) {
      case 'touchstart': {
        this.setState({
          touchScrollTop: this.state.scrollTop,
          startY: touches[0].clientY,
          needPullDown: true,
        });
        break;
      }
      case 'touchmove': {
        // const { clientY: preClientY = 1 } = this.state.blockStyle;
        const {clientY} = touches[0];
        const {touchScrollTop} = this.state;
        const height = Math.floor((clientY - startY) / 5);
        // 拖动方向不符合的不处理
        if (height < 0 || touchScrollTop > 5) return;
        this.setState({canScrollY: false});

        e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
        if (height > 0 && height < damping) {
          if (height < distanceToRefresh) {
            this.setState({needPullDown: true});
          } else {
            this.setState({needPullDown: false});
          }
          this.setState({
            blockStyle: {
              transform: `translate3d(0,${height}px,0)`,
              transition: 'none',
            },
          });
        }
        break;
      }
      case 'touchend': {
        if (!this.state.needPullDown) {
          this.fetchInit();
        } else {
          this.resetLoad();
        }
        break;
      }
      case 'touchcancel': {
        if (!this.state.needPullDown) {
          this.fetchInit();
        } else {
          this.resetLoad();
        }
        break;
      }
      default: {
        // console.log('foo');
      }
    }
  };

  fetchInit = () => {
    const {onPullDownRefresh, distanceToRefresh} = this.props;
    this.resetLoad(distanceToRefresh);
    if (onPullDownRefresh) {
      onPullDownRefresh(() => {
        this.setState({isInit: true});
        this.resetLoad(0, () => {
          this.setState({isInit: false});
        });
      });
    }
  };

  resetLoad = (height, cb?) => {
    //状态断言： 0：恢复, distanceToRefresh: 加载中
    const {distanceToRefresh} = this.props;
    let canScrollY = false;
    if (height === 0) {
      canScrollY = true;
    }
    this.setState({
      canScrollY,
      blockStyle: {
        transform: `translate3d(0,${height}px,0)`,
        transition: 'all 300ms',
      },
      needPullDown: true,
      downLoading: height === distanceToRefresh,
    });
    // todo 监听真正动画结束
    setTimeout(function () {
      if (cb) cb();
    }, 400);
  };

  handleScrollToLower = () => {
    throttle(() => {
      this.getMore();
    });
  };

  getMore = () => {
    const {onScrollToLower, hasMore} = this.props;
    const {lowerLoading} = this.state;
    if (hasMore && !lowerLoading && onScrollToLower) {
      this.setState({lowerLoading: true});
      onScrollToLower(() => {
        this.setState({lowerLoading: false});
      });
    }
  };

  onScroll = e => {
    const {
      detail: {scrollTop},
    } = e;
    this.setState({scrollTop });
  };

  render() {
    const {
      style,
      tipFreedText,
      tipText,
      hasMore,
      noMore,
      isEmpty = false,
      emptyText = '',
      className,
      isError = false,
      isLoaded,
      selector,
      launch,
      indicator,
      footerLoadingText,
      footerLoadedText,
      damping
    } = this.props;
    const {launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false} = launch as Launch;
    const {release = '加载中', activate = '下拉刷新', deactivate = '释放刷新'} = indicator as Indicator;
    const {canScrollY, isInit, blockStyle, needPullDown, downLoading, lowerLoading} = this.state;

    const showTipText = !downLoading && needPullDown && !isInit; // 下拉文案
    const showTipFreedText = !downLoading && !needPullDown && !isInit;// 释放文案

    const showChildren = !(isEmpty || isError); // 展示children内容

    const showFooter = !isEmpty && !isError; // 空、错状态不展示底部
    const footerLoaded = showFooter && !launchFooterLoaded && !hasMore;
    const customFooterLoaded = showFooter && launchFooterLoaded && !hasMore; // 渲染renderLoadedText
    const footerLoading = showFooter && !launchFooterLoading && lowerLoading;
    const customFooterLoading = showFooter && launchFooterLoading && lowerLoading; // 渲染renderNoMore

    const newStyle = {...style };

    const bodyStyle = {
      minHeight: '100%',
      ...blockStyle
    }
    //taro scrollView 组建scrollY无效
    return (
      <Skeleton isLoaded={isLoaded || isError} selector={selector}>
        <ScrollView
          ref={node => {
            this.scrollView = node;
          }}
          className={`${className}`}
          style={newStyle}
          scrollY={canScrollY}
          lowerThreshold={20}
          onScrollToLower={this.handleScrollToLower}
          scrollWithAnimation
          onScroll={this.onScroll}
        >
          <View
            style={bodyStyle}
            onTouchMove={(e) => this.touchEvent(e)}
            onTouchEnd={(e) => this.touchEvent(e)}
            onTouchStart={(e) => this.touchEvent(e)}
            onTouchCancel={(e) => this.touchEvent(e)}
          >
            <View className='pullDownBlock' style={{ height: damping }}>
              <View className='tip'>
                {showTipFreedText && <View>{deactivate || tipFreedText}</View>}
                {showTipText && <View>{activate || tipText}</View>}
                {downLoading && <View>{release}</View>}
              </View>
            </View>
            {/* present children */}
            {showChildren && this.props.children}

            <ResultPage
              renderError={this.props.renderError}
              renderEmpty={this.props.renderEmpty}
              launchError={launchError}
              launchEmpty={launchEmpty}
              isError={isError}
              isEmpty={isEmpty}
              emptyText={emptyText}
              fetchInit={this.fetchInit}
            />
            {/* default page */}
            {
              footerLoading && (
                <View className='loading'>
                  {footerLoadingText}
                </View>
              )
            }
            {/* custom footer loading page*/}
            {
              customFooterLoading && this.props.renderFooterLoading
            }
            {/* default footer loaded page*/}
            {
              footerLoaded && (
                <View className='loaded'>
                  {noMore || footerLoadedText}
                </View>
              )
            }
            {/* custom footer loaded page*/}
            {
              customFooterLoaded && this.props.renderFooterLoaded
            }
          </View>
        </ScrollView>
      </Skeleton>
    );
  }
}

export default ListView;
