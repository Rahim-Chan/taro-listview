import Taro, { Component } from '@tarojs/taro';
import { Image, View } from '@tarojs/components';
import emptyImg from "../list-view/assets/empty.png";
import './index.scss';

interface PagePros {
  renderError?: JSX.Element;
  renderEmpty?: JSX.Element;
  isError: boolean;
  launchError: boolean;
  isEmpty: boolean;
  launchEmpty: boolean;
  emptyText: string;
  fetchInit: () => void;
}
class Page extends Component<PagePros> {
  render() {
    const { isError, launchError, launchEmpty, isEmpty, emptyText, fetchInit } = this.props;
    const showError = isError; // isErrorUI权重最高
    const showErrorText = showError && !launchError; // 渲染ErrorText
    const showRenderError = showError && launchError; // 渲染renderError

    const showEmpty = !isError && isEmpty; // isErrorUI权重最高
    const showEmptyText = showEmpty && !launchEmpty; // 渲染emptyText
    const showRenderEmpty = showEmpty && launchEmpty; // 渲染renderEmpty
    return (
      <View>
        {showErrorText && (
          <View className='errorPage'>
            <View className='marginBottom30'>啊哦，网络悄悄跑到外星球去了~</View>
            <View className='button' onClick={fetchInit}>
              重新加载
            </View>
          </View>
        )}
        {/* custom error page */}
        {showRenderError ? this.props.renderError : ''}
        {/* default blank page */}
        {showEmptyText && (
          <View className='noContentTips'>
            <Image src={emptyImg} className='emptyBanner' />
            {emptyText}
          </View>
        )}
        {/* custom blank page */}
        {showRenderEmpty ? this.props.renderEmpty : ''}
      </View>
    )}
}

export default Page;
