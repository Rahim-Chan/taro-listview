import Taro, {Component} from '@tarojs/taro';
import {View} from '@tarojs/components';
import './block.scss'
import storage from "../../utils/storage";
import tools from "./tool";


interface LazyItem {
  key: string;
  className: string;
  viewHeight: number;
}

interface State {

}

interface Props {
  className?: string;
  current: number;
  lazyStorage?: string;
}

class LazyImage extends Component<Props, State> {
  static options = {
    addGlobalClass: true,
  };

  static externalClasses = ['img-class']

  lazyItem: LazyItem = {} as LazyItem;

  state = {
    scrollCur: [0]
  };

  static defaultProps = {
    lazyStorage: 'box'
  };

  componentDidMount() {
    const { lazyStorage } = this.props;
    this.lazyItem = storage.get(`lazyBox_${lazyStorage}`)[storage.get(`lazyBox_${lazyStorage}`).length -1];
    this.bindTextListener();
  }

  componentWillUnmount(): void {
    const { key } = this.lazyItem;
    Taro.eventCenter.off(`lazyBlock${key}`);
  }

  // 绑定函数
  bindTextListener() {
    const { key, className, viewHeight } = this.lazyItem;
    Taro.eventCenter.on(`lazyBlock${key}`, scrollCur => {
        this.setState({
          scrollCur
        })
      });
    // @ts-ignore
    Taro[key] = Taro.eventCenter.trigger.bind(Taro.eventCenter, `lazyBlock${key}`);
    setTimeout(() => {
      tools.lazyScroll(key, className, viewHeight)
    }, 0)
  }

  isLoad = (current) => {
    return this.state.scrollCur.includes(current);
  };

  render() {
    const {current} = this.props;
    return (
        <View className={`lazy-image-${this.lazyItem.key} ${this.props.className} `}>
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