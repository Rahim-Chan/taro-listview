import Taro, {Component} from '@tarojs/taro';
import {ScrollView, View } from '@tarojs/components';
import Skeleton from '../skeleton';
import Loading from '../loading';
import tools from './tool'
import ResultPage from '../result-page';
import { initialProps, initialState } from './init'
import { Props, Indicator, Launch } from './type';
import './index.scss';

type State = Readonly<typeof initialState>

class ListView extends Component<Props, State> {
  static defaultProps = initialProps;

  state = initialState;
  // eslint-disable-next-line react/sort-comp
  lazyClassName = (() => {
    return typeof this.props.lazy === 'boolean' ? '.lazy-view': this.props.lazy;
  })();

  lazyKey = (
    () => {
      if (this.props.lazy) {
        return  tools.lazyScrollInit(this.lazyClassName)
      }
    }
  )();

  lazyViewHeight = 0;

  static options = {
    addGlobalClass: true,
  };

  onRefresh = () => {
    this.setState({downLoading: true});
    const {onPullDownRefresh} = this.props;
    if (onPullDownRefresh) {
      const cancel = () => {
        this.setState({downLoading: false})
      };
      onPullDownRefresh(cancel)
    }
  };

  scrollView = {};

  startY = 0;

  touchScrollTop = 0;

  componentDidMount() {
    this.$scope.onRefresh = this.onRefresh;
    this.$scope.updateDampText = this.updateDampText;
    if (this.props.lazy) {
      Taro.createSelectorQuery().in(this.$scope)
        .select('.scrollView')
        .boundingClientRect()
        .exec(res => {
          tools.updateScrollHeight(this.lazyKey, res[0].height)
          this.lazyViewHeight = res[0].height
        })
    }
    if (this.props.needInit) this.fetchInit();
  }

  componentWillUnmount(): void {
    tools.lazyScrollRemove()
  }

  fetchInit = () => {
    const {onPullDownRefresh} = this.props;
    if (onPullDownRefresh) {
      onPullDownRefresh(() => {
        this.setState({isInit: true});
      });
    }
  };

  handleScrollToLower = () => {
    tools.debounce(() => {
      this.getMore();
    })();
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

  onScroll = () => {
    if (this.props.onScroll) this.props.onScroll()
    if (this.props.lazy) {
      tools.lazyScroll(this.lazyKey,this.lazyClassName, this.lazyViewHeight )
    }
  };

  updateDampText = ({ act, show = true }) => {
    const { indicator = {}, tipFreedText, tipText } = this.props;
    const {activate = '下拉刷新', deactivate = '释放刷新'} = indicator as Indicator;
    let text = ''
    if (!act) {
      text = activate || tipText
    } else {
      text = deactivate || tipFreedText
    }

    this.setState({ dampText: text, hideInd: !show })
  }

  render() {
    const {
      style,
      hasMore,
      noMore,
      isEmpty,
      emptyText,
      className,
      isError,
      isLoaded,
      selector,
      launch = {},
      footerLoadingText,
      footerLoadedText,
      damping,
      distanceToRefresh,
      circleColor,
      showIndicator,
      indicator,
    } = this.props;
    const {launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false} = launch as Launch;
    const {downLoading, dampText, hideInd } = this.state;
    const showChildren = !(isEmpty || isError); // 展示children内容
    const showFooter = !downLoading && !isEmpty && !isError; // 空、错状态不展示底部
    const footerLoaded = showFooter && !launchFooterLoaded && !hasMore;
    const customFooterLoaded = showFooter && launchFooterLoaded && !hasMore; // 渲染renderLoadedText
    const footerLoading = showFooter && !launchFooterLoading && hasMore;
    const customFooterLoading = showFooter && launchFooterLoading && hasMore; // 渲染renderNoMore
    return (
      <Skeleton isLoaded={isLoaded || isError} selector={selector}>
        <wxs module='pulldown' src='./pulldown.wxs'></wxs>
        <include src='./index.template.wxml' />
        <ScrollView
          ref={node => {
            this.scrollView = node;
          }}
          className={`${className} scrollView`}
          style={style}
          scrollY={!downLoading}
          lowerThreshold={80}
          onScrollToLower={this.handleScrollToLower}
          scrollWithAnimation
          onScroll={this.onScroll}
          onTouchStart='{{pulldown.handleTouchStart}}'
          onTouchMove='{{pulldown.handleTouchMove}}'
          onTouchEnd='{{pulldown.handleTouchEnd}}'
          onTouchCancel='{{pulldown.handleTouchEnd}}'
        >
          <View
            data-config={{
              damping,
              distanceToRefresh
            }}
            className='bodyView'
            id='bodyView'
          >
            <View
              data-config={showIndicator}
              style={{ height: `${damping}px`, marginTop: `-${damping}px` }}
              className='pullDownBlock indicator'
            >
              <View className='tip'>
                {
                  !downLoading && <View id='tip-dampText'>{dampText}</View>
                }
                {downLoading && <Loading color={circleColor} />}
              </View>
            </View>
            {/* present children */}
            {showChildren && this.props.children}
            <ResultPage
              renderError={this.props.renderError}
              renderEmpty={this.props.renderEmpty}
              launchError={launchError}
              launchEmpty={launchEmpty}
              isError={isError || false}
              isEmpty={isEmpty || false}
              emptyText={emptyText || ''}
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
