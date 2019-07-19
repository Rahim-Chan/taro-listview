import Taro, { Component } from '@tarojs/taro';
import { ScrollView, View } from '@tarojs/components';
import Skeleton  from '../skeleton';
import { throttle } from '../../utils/utils';
import emptyImg from './assets/empty.png'
import './index.scss';

interface State {
  blockStyle: any;
  canScrollY: boolean;
  startY: number;
  needPullDown: boolean;
  touchScrollTop: number;
  downLoading: boolean;
  lowerLoading: boolean;
  scrollTop: number;
  isInit: boolean;
  lowerDistance: number;
}

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
  isEmpty: boolean;
  isError?: boolean;
  launch?: Launch;
  renderEmpty?: any;
  renderError?: any;
  renderFooterLoading?: any;
  renderFooterLoaded?: any;
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

class ListView extends Component<Props, State> {
  static options = {
    addGlobalClass: true,
  };

  static defaultProps = {
    distanceToRefresh: 30,
    isLoaded: true,
    isEmpty: false,
    emptyText: '',
    noMore: '暂无更多内容',
    footerLoadingText: '加载中...',
    footerLoadedText: '暂无更多内容',
    scrollTop: 0,
    touchScrollTop: 0,
    onScrollToLower: () => {},
    onPullDownRefresh: null,
    hasMore: false,
    needInit: false,
    isError: false,
    launch: {},
    renderEmpty: null,
    renderError: null,
    indicator: {}
  };

  scrollView = {};

  state = {
    canScrollY: true,
    touchScrollTop: 0,
    lowerDistance: 0,
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

  touchEvent = (e: TouchEvent) => {
    const { startY } = this.state;
    const { type, touches } = e;
    const { onPullDownRefresh } = this.props;
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
        const { clientY } = touches[0];
        const { touchScrollTop } = this.state;
        const height = Math.floor((clientY - startY) / 5);
        // 拖动方向不符合的不处理
        if (height < 0 || touchScrollTop > 5) return;
        this.setState({ canScrollY: false });

        e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
        if (height > 0 && height < 80) {
          if (height < 50) {
            this.setState({ needPullDown: true });
          } else {
            this.setState({ needPullDown: false });
          }
          this.setState({
            blockStyle: {
              height: `${height}px`,
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
          this.resetLoad(0);
        }
        break;
      }
      case 'touchcancel': {
        if (!this.state.needPullDown) {
          this.fetchInit();
        } else {
          this.resetLoad(0);
        }
        break;
      }
      default: {
        // console.log('foo');
      }
    }
  };

  fetchInit = () => {
    const { onPullDownRefresh } = this.props;
    this.resetLoad(30);
    if (onPullDownRefresh) {
      onPullDownRefresh(() => {
        this.setState({ isInit: true });
        this.resetLoad(0, () => {
          this.setState({ isInit: false });
        });
      });
    }
  };

  resetLoad = (height = 0, cb?) => {
    const { distanceToRefresh } = this.props;
    let canScrollY = false;
    if (height === 0) {
      canScrollY = true;
    }
    this.setState({
      canScrollY,
      blockStyle: {
        height: `${height}px`,
        transition: 'height 300ms',
        needPullDown: true,
      },
      downLoading: height === distanceToRefresh,
    });
    // todo 监听真正动画结束
    setTimeout(function() {
      if (cb) cb();
    }, 400);
  };

  handleScrollToLower = () => {
    throttle(() => {
      this.getMore();
    });
  };

  getMore = () => {
    const { onScrollToLower, hasMore } = this.props;
    const { lowerLoading } = this.state;
    if (hasMore && !lowerLoading && onScrollToLower) {
      this.setState({ lowerLoading: true });
      onScrollToLower(() => {
        this.setState({ lowerLoading: false });
      });
    }
  };

  onScroll = e => {
    const {
      detail: { scrollTop, scrollHeight },
    } = e;
    this.setState({ scrollTop, lowerDistance: scrollHeight - scrollTop });
  };

  render() {
    const {
      style,
      tipFreedText,
      tipText,
      hasMore,
      noMore,
      isEmpty,
      emptyText,
      className,
      isError,
      isLoaded,
      selector,
      launch,
      indicator,
      footerLoadingText,
      footerLoadedText
    } = this.props;
    const { launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false } = launch as Launch;
    const { release = '加载中', activate = '下拉刷新', deactivate = '释放刷新' } = indicator as Indicator;
    const { canScrollY, isInit, blockStyle, needPullDown, downLoading, lowerLoading } = this.state;

    const showTipText = !downLoading && needPullDown && !isInit; // 下拉文案
    const showTipFreedText = !downLoading && !needPullDown && !isInit;// 释放文案

    const showChildren = !(isEmpty || isError); // 展示children内容

    const showFooter = !isEmpty && !isError; // 空、错状态不展示底部
    const footerLoaded = showFooter && !launchFooterLoaded && !hasMore;
    const customFooterLoaded = showFooter && launchFooterLoaded && !hasMore; // 渲染renderLoadedText
    const footerLoading = showFooter && !launchFooterLoading && lowerLoading;
    const customFooterLoading = showFooter && launchFooterLoading && lowerLoading; // 渲染renderNoMore

    const showError = isError; // isErrorUI权重最高
    const showErrorText = showError && !launchError; // 渲染ErrorText
    const showRenderError = showError && launchError; // 渲染renderError
    const showEmpty = !isError && !downLoading && isEmpty; // isErrorUI权重最高
    const showEmptyText = showEmpty && !launchEmpty; // 渲染emptyText
    const showRenderEmpty = showEmpty && launchEmpty; // 渲染renderEmpty

    return (
      <Skeleton isLoaded={isLoaded || isError} selector={selector}>
        <ScrollView
          ref={node => {
            this.scrollView = node;
          }}
          className={`${className} scrollView refView`}
          style={style}
          scrollY={canScrollY}
          lowerThreshold={20}
          onScrollToLower={this.handleScrollToLower}
          scrollWithAnimation
          onScroll={this.onScroll}
        >
          <View
            style={{ minHeight: '100%' }}
            onTouchMove={this.touchEvent}
            onTouchEnd={this.touchEvent}
            onTouchStart={this.touchEvent}
            onTouchCancel={this.touchEvent}
          >
            <View style={blockStyle} className='pullDownBlock'>
              <View className='tip'>
                {showTipFreedText && <View>{ activate ||tipFreedText}</View>}
                {showTipText && <View>{ deactivate ||tipText}</View>}
                {downLoading && <View>{release}</View>}
              </View>
            </View>
            {/* present children */}
            {showChildren && this.props.children}
            {/* default error page */}
            {showErrorText && (
              <View className="error-page">
                <View className="marginBottom30">啊哦，网络悄悄跑到外星球去了~</View>
                <View className="button" onClick={this.fetchInit}>
                  重新加载
                </View>
              </View>
            )}
            {/* custom error page */}
            {showRenderError && this.props.renderError}
            {/* default blank page */}
            {showEmptyText && (
              <View className="noContentTips">
                <Image src={emptyImg} alt="" className='empty-banner'/>
                {emptyText}
              </View>
            )}
            {/* custom blank page */}
            {showRenderEmpty && this.props.renderEmpty}
            {/* default page */}
            {
              footerLoading && (
                <View className='loading'>
                  { footerLoadingText }
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
                  { noMore || footerLoadedText }
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
