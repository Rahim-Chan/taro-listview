import Taro, {useState, useEffect } from '@tarojs/taro';
import {View, ScrollView} from '@tarojs/components';
import {utils} from './use-list';
import { throttle } from "../../utils/utils";

interface Props {
  children?: any;
  identifier: string | number;
  onScrollToLower?: () => void;
  itemHeight: ((index: number) => number) | string | number;
}

const VirList: Taro.FunctionComponent<Props>= (props) => {
  const { onScrollToLower, identifier, itemHeight } = props;
  const [totalHeight, setHeight] = useState();
  const handleLower = () => {
    throttle(() => {
      // fetchList()
      // getReady(false)
      if(onScrollToLower) onScrollToLower()
    }, 800)
  }

  useEffect(() => {
    // ctx.calcHeight(setHeight)
    // utils[identifier].setIsMount(false)
    utils[identifier].setProps('itemHeight', itemHeight)
    utils[identifier].setProps('setHeight', setHeight)
    console.log('**vr父组件方法挂载--完毕')
    utils[identifier].setMount(true)
  }, [identifier, itemHeight, setHeight]);

  const handleScroll = (e) => {
    const {detail: {scrollTop}} = e;
    utils[props.identifier].render(scrollTop)
  };

  return (
    <ScrollView
      style={{ height: '100vh', width: '50vw', display: 'inline-block' }}
      // className='recycleWrap'
      scrollY
      onScroll={handleScroll}
      lowerThreshold={20}
      onScrollToLower={handleLower}
    >
      <View id='foo' className='recycleList' style={{ position:'relative', height: `${totalHeight}px` }}>
        {this.props.children}
      </View>
    </ScrollView>
  )
}
export default VirList
