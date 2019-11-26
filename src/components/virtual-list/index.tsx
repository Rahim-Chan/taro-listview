import Taro, {useState, useEffect, useRef } from '@tarojs/taro';
import {View, ScrollView} from '@tarojs/components';
import { throttle } from "../../utils/utils";
import tool from "./virtual";

interface Props {
  children?: any;
  list: any[];
  identifier?: string | number;
  onScrollToLower?: () => void;
}
const itemSize = {
  width: 100,
  height: 100,
}
const { windowHeight } = Taro.getSystemInfoSync();
let visibleCount = 0;
let spaceCount = 0;
const spaceStep = .2;
const VirList: Taro.FunctionComponent<Props>= (props) => {
  const isLast = useRef(false);
  const preIndex = useRef(0);
  const [vrKey, setVr] = useState('');
  const { list = [], onScrollToLower } = props;
  const [makeUpList, setMUList] = useState([{ bottom: 0 }]);
  const [startIndex, setStartIndex] = useState(0)
  const [totalHeight, setHeight] = useState();
  const handleLower = () => {
    throttle(() => {
      console.log('handleLower')
      // fetchList()
      onScrollToLower()
    }, 800)
  }

  useEffect(() => {
    let index = startIndex;
    if (index > spaceCount) {
      index -= spaceCount
    } else {
      index = 0
    }
    preIndex.current = index;
  }, [startIndex]);

  useEffect(() => {
    if (vrKey) {
      if (!isLast.current) {
        throttle(() => {
          // console.log([preIndex.current, startIndex + spaceCount])
          Taro[vrKey]([preIndex.current, startIndex + spaceCount])
        }, 300)
        tool.setRange(vrKey, [preIndex.current, startIndex + spaceCount])
      }
      isLast.current = !(startIndex + visibleCount <= list.length-1)
    }
  }, [list.length, startIndex, vrKey]);

  useEffect(() => {
    // 初始化
    setVr(tool.initVir(props.identifier))
    visibleCount = Math.ceil(windowHeight / itemSize.height);
    spaceCount = visibleCount + Math.ceil(visibleCount * spaceStep);
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

  // useEffect(() => {
  //   setStartIndex(0)
  // }, [makeUpList])

  
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
      id='foo'
    >
    
      <View className='recycleList' style={{ height: totalHeight }}>
        {this.props.children}
      </View>
    </ScrollView>
  )
}
export default VirList