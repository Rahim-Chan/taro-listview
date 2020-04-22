import Taro, {Component} from '@tarojs/taro';
import {ScrollView, View } from '@tarojs/components';
import Skeleton from '../skeleton';
import tools from './tool'
import ResultPage from '../result-page';
import { initialProps, initialState } from './init'
// eslint-disable-next-line no-unused-vars
import { Props, Indicator, Launch, State } from './type';
import {isPromise, minGetMore} from '../../utils/utils';
import './index.scss';


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

  onRefresh = async () => {
    this.setState({downLoading: true});
    const {onPullDownRefresh, async} = this.props;
    if (onPullDownRefresh) {
      const cancel = () => {
        this.setState({downLoading: false})
      };
      if (!async) {
        onPullDownRefresh(cancel);
      } else {
        await onPullDownRefresh();
        cancel()
      }
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

  fetchInit = async () => {
    this.onRefresh();
  };

  handleScrollToLower = () => {
    console.log('handleScrollToLower')
    tools.debounce(() => {
      minGetMore(this);
    })();
  };

  onScroll = () => {
    if (this.props.onScroll) this.props.onScroll()
    if (this.props.lazy) {
      tools.lazyScroll(this.lazyKey,this.lazyClassName, this.lazyViewHeight )
    }
  };

  updateDampText = ({ act }) => {
    const { indicator = {}, tipFreedText, tipText } = this.props;
    const {activate = '下拉刷新', deactivate = '释放刷新'} = indicator as Indicator;
    let text = ''
    if (!act) {
      text = activate || tipText
    } else {
      text = deactivate || tipFreedText
    }

    this.setState({ dampText: text })
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
      autoHeight,
      isLoaded,
      selector,
      launch = {},
      footerLoadingText,
      footerLoadedText,
    } = this.props;
    const {launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false} = launch as Launch;
    const {downLoading} = this.state;
    const showChildren = !(isEmpty || isError); // 展示children内容
    const showFooter = !downLoading && !isEmpty && !isError; // 空、错状态不展示底部
    const footerLoaded = showFooter && !launchFooterLoaded && !hasMore;
    const customFooterLoaded = showFooter && launchFooterLoaded && !hasMore; // 渲染renderLoadedText
    const footerLoading = showFooter && !launchFooterLoading && hasMore;
    const customFooterLoading = showFooter && launchFooterLoading && hasMore; // 渲染renderNoMore

    if (autoHeight) {
      return (
        <ScrollView
          ref={node => {
            this.scrollView = node;
          }}
          className={`${className} scrollView autoHeight`}
          style={style}
          scrollY={!downLoading}
          lowerThreshold={80}
          onScrollToLower={this.handleScrollToLower}
          scrollWithAnimation
          refresher-enabled
          refresherTriggered={downLoading}
          refresherThreshold={100}
          // onRefresherRestore={(e) => console.log(e)}
          onRefresherRefresh={this.onRefresh}
          onScroll={this.onScroll}
        >
          <View
            className='bodyView'
            id='bodyView'
          >
            {/* present children */}
            {showChildren && this.props.children}
            <ResultPage
              //eslint-disable-next-line taro/render-props
              renderError={this.props.renderError}
              // eslint-disable-next-line taro/render-props
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
                  {footerLoadedText || noMore}
                </View>
              )
            }
            {/* custom footer loaded page*/}
            {
              customFooterLoaded && this.props.renderFooterLoaded
            }
          </View>
        </ScrollView>
      )
    }

    return (
      <Skeleton isLoaded={isLoaded || isError} selector={selector}>
        <ScrollView
          ref={node => {
            this.scrollView = node;
          }}
          className={`${className} scrollView autoHeight`}
          style={style}
          scrollY={!downLoading}
          lowerThreshold={80}
          onScrollToLower={this.handleScrollToLower}
          scrollWithAnimation
          refresher-enabled
          refresherTriggered={downLoading}
          refresherThreshold={100}
          // onRefresherRestore={(e) => console.log(e)}
          onRefresherRefresh={this.onRefresh}
          onScroll={this.onScroll}
        >
          <View
            className='bodyView'
            id='bodyView'
          >
            {/* present children */}
            {showChildren && this.props.children}
            <ResultPage
              //eslint-disable-next-line taro/render-props
              renderError={this.props.renderError}
              // eslint-disable-next-line taro/render-props
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
                  {footerLoadedText || noMore}
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
