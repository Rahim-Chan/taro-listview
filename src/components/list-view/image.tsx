import Taro, {Component} from '@tarojs/taro';
import {Image, View} from '@tarojs/components';
import {ImageProps} from "@tarojs/components/types/Image";
import './image.scss'
import storage from "../../utils/storage";

interface State {

}

interface Props extends ImageProps {
  current: number;
}

class LazyImage extends Component<Props, State> {
  static options = {
    addGlobalClass: true,
  };

  static externalClasses = ['img-class']

  state = {
    scrollCur: [0]
  };

  componentDidMount() {
    this.bindTextListener();
  }

  componentDidShow = () => {
    Taro.eventCenter.off('lazyImage');
  }

  componentDidHide = () => {
    Taro.eventCenter.off('lazyImage');
  }

  bindTextListener() {
    Taro.eventCenter.on('lazyImage', scrollCur => {
      console.log(scrollCur)
      this.setState({
        scrollCur
      })
    });
    // 绑定函数
    // @ts-ignore
    const lazyKey = storage.get('lazyKeys').pop()
    Taro[lazyKey] = Taro.eventCenter.trigger.bind(Taro.eventCenter, 'lazyImage');
  }

  isLoad = (current) => {
    return this.state.scrollCur.indexOf(current) > -1;
  };

  render() {
    const {current, src, onClick, mode} = this.props;
    return this.isLoad(current) ? (
      <Image
        lazyLoad
        onClick={onClick}
        src={src}
        className={`lazy-image imageLoad ${this.props.className}`}
        mode={mode}
      />
    ) : (
      <View className={`lazy-image ${this.props.className}`} />
    );
  }
}

export default LazyImage;