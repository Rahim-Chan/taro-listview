import Taro, {useState, useEffect } from '@tarojs/taro';
import {View, ScrollView} from '@tarojs/components';
import { ctx } from "components/virtual-list/hooks-list";
import { throttle } from "../../utils/utils";

interface Props {
  children?: any;
  identifier?: string | number;
  onScrollToLower?: () => void;
}

const VirList: Taro.FunctionComponent<Props>= (props) => {
  const { onScrollToLower } = props;
  const [totalHeight, setHeight] = useState();
  const handleLower = () => {
    throttle(() => {
      // fetchList()
      // getReady(false)
      if(onScrollToLower) onScrollToLower()
    }, 800)
  }

  useEffect(() => {
    console.log(this)
    // ctx.calcHeight(setHeight)
  }, []);

  const handleScroll = (e) => {
    const { detail: { scrollTop }} = e;
    // ctx.updateList(scrollTop)
  }
  // console.log(totalHeight)
  return (
    <ScrollView
      style={{ height: '100vh' }}
      // className='recycleWrap'
      scrollY
      onScroll={handleScroll}
      lowerThreshold={20}
      onScrollToLower={handleLower}
      id='foo1'
    >
      <View id='foo' className='recycleList' style={{ height: totalHeight }}>
        {this.props.children}
      </View>
    </ScrollView>
  )
}
export default VirList
