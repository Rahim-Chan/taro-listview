import Taro, {useState, useEffect, useRef } from '@tarojs/taro';
import {View, ScrollView} from '@tarojs/components';
import { throttle } from "../../utils/utils";
import tool from "./virtual";

interface Props {
  children?: any;
  list: any[];
  identifier?: string | number;
}
const itemSize = {
  width: 100,
  height: 100,
}
const { windowHeight } = Taro.getSystemInfoSync();
let preIndex = 0;
let visibleCount = 0;
let spaceCount = 0;
const VirList: Taro.FunctionComponent<Props>= (props) => {
  const isLast = useRef();
  const keyRef = useRef();
  const { list } = props;
  const [makeUpList, setMUList] = useState([]);
  const [startIndex, setStartIndex] = useState(0)
  const [totalHeight, setHeight] = useState();
  const handleLower = () => {
    throttle(() => {
      console.log('handleLower')
      // fetchList()
    }, 800)
  }

  useEffect(() => {
    let index = startIndex;
    if (index > spaceCount) {
      index -= spaceCount
    } else {
      index = 0
    }
    preIndex = index;
  }, [startIndex]);

  useEffect(() => {
    if (keyRef.current) {
      if (!isLast.current) {
        Taro[keyRef.current]([preIndex, startIndex + spaceCount])
      }
      isLast.current = !(startIndex + visibleCount <= list.length-1)
    }
  }, [list.length, startIndex]);

  useEffect(() => {
    // 初始化
    keyRef.current = tool.initVir(props.identifier);
    visibleCount = Math.ceil(windowHeight / itemSize.height);
    spaceCount = visibleCount = Math.ceil(visibleCount * 1.5);
  }, [props.identifier]);
  //
  useEffect(() => {
    if (!list.length) return;
    setHeight(list.length * itemSize.height + 'px')
    const temList = list.map((item, y) => {
      return {
        bottom:(y + 1) * itemSize.height,
      }
    })
    setMUList(temList)
  }, [list]);

  const binarySearch = (res,value) => {
    const index = res.findIndex(i => i && i.bottom > value);
    setStartIndex(index)
    // cacheStartIndex = index;
  };

  const handleScroll = (e) => {
    const { detail: { scrollTop }} = e;
    binarySearch(makeUpList, scrollTop)
  }

  return (
    <ScrollView
      style={{ height: '100vh' }}
      // className='recycleWrap'
      scrollY
      onScroll={handleScroll}
      lowerThreshold={20}
      onScrollToLower={handleLower}
    >
      <View className='recycleList' style={{ height: totalHeight }}>
        {this.props.children}
      </View>
    </ScrollView>
  )
}
export default VirList