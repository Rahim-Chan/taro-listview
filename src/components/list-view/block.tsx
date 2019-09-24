import Taro, {Component} from '@tarojs/taro';
import {View} from '@tarojs/components';
import './block.scss'
import storage from "../../utils/storage";
import tools from "./tool";

interface State {

}

interface Props {
  className?: string;
  current: number;
}

class LazyImage extends Component<Props, State> {
  static options = {
    addGlobalClass: true,
  };

  static externalClasses = ['img-class']

  lazyClassName = '';

  lazyKey = '';

  state = {
    scrollCur: [0]
  };

  componentDidMount() {
    const lazyItem = storage.get('lazyBox')[storage.get('lazyBox').length -1];
    this.lazyKey = lazyItem.key;
    this.lazyClassName = lazyItem.className;
    console.log(lazyItem)
    this.bindTextListener();
  }

  componentWillUnmount(): void {
    Taro.eventCenter.off(`lazyBlock${this.lazyKey}`);
  }

  bindTextListener() {
    Taro.eventCenter.on(`lazyBlock${this.lazyKey}`, scrollCur => {
      this.setState({
        scrollCur
      })
    });
    // 绑定函数
    // @ts-ignore
    Taro[this.lazyKey] = Taro.eventCenter.trigger.bind(Taro.eventCenter, `lazyBlock${this.lazyKey}`);
    tools.lazyScroll(this.lazyKey, this.lazyClassName)
  }

  isLoad = (current) => {
    return this.state.scrollCur.includes(current);
  };

  render() {
    const {current} = this.props;
    return (
        <View className={`lazy-image-${this.lazyKey} ${this.props.className} `}>
          {
            this.isLoad(current) ? (
                <View className='blockLoad'>
                  {
                    this.props.children
                  }
                </View>
            ) : (
                ''
            )
          }
        </View>
    )
  }
}

export default LazyImage;