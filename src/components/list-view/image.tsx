import Taro, {Component} from '@tarojs/taro';
import {Image, View} from '@tarojs/components';
import {ImageProps} from "@tarojs/components/types/Image";
import './image.scss'
import storage from "../../utils/storage";
import tools from "./tool";

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

  lazyKey = '';

  state = {
    scrollCur: [0]
  };

  componentDidMount() {
    this.lazyKey = storage.get('lazyKeys',[])[storage.get('lazyKeys').length -1];
    this.bindTextListener();
  }

  componentWillUnmount(): void {
    Taro.eventCenter.off(`lazyImage${this.lazyKey}`);
  }

  bindTextListener() {
    Taro.eventCenter.on(`lazyImage${this.lazyKey}`, scrollCur => {
      // console.log(scrollCur)
      this.setState({
        scrollCur
      })
    });
    // 绑定函数
    // @ts-ignore
    Taro[this.lazyKey] = Taro.eventCenter.trigger.bind(Taro.eventCenter, `lazyImage${this.lazyKey}`);
    tools.lazyScroll(this.lazyKey)
  }

  isLoad = (current) => {
    return this.state.scrollCur.includes(current);
  };

  render() {
    const {current, src, onClick, mode} = this.props;
    return (
        <View>
          {
            this.isLoad(current) ? (
                <Image
                    onClick={onClick}
                    src={src}
                    className={`lazy-image-${this.lazyKey} ${this.props.className}`}
                    mode={mode}
                />
            ) : (
                <View className={`lazy-image-${this.lazyKey} ${this.props.className}`} />
            )
          }
        </View>
    )
  }
}

export default LazyImage;