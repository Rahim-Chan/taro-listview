import Taro, {useState, useEffect, useRef } from '@tarojs/taro';
import {View, ScrollView} from '@tarojs/components';
import { throttle } from "../../utils/utils";
import tool, {registered} from "./virtual";

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
  const [vrKey] = useState(props.identifier);
  const { list = [], onScrollToLower } = props;
  const [makeUpList, setMUList] = useState([{ bottom: 0 }]);
  const [startIndex, setStartIndex] = useState(0)
  const [totalHeight, setHeight] = useState();
  const [isReady, getReady] = useState(false)

  const handleLower = () => {
    throttle(() => {
      // fetchList()
      onScrollToLower()
    }, 800)
  }

  useEffect(() => {
    // 初始化
    tool.initVir(props.identifier)
  }, [props.identifier])
  useEffect(() => {
    if (list.length) {
      //registered the son lister
      registered(props.identifier, list.length)
      // confirm all child is ready;
      Taro.eventCenter.on(`${props.identifier}-cb`, nthSon => {
        // console.log(nthSon, 'nthSon', list.length)
        if (nthSon === list.length-1) {
          getReady(true)
        }
      });
    }

    visibleCount = Math.ceil(windowHeight / itemSize.height);
    spaceCount = visibleCount + Math.ceil(visibleCount * spaceStep);
    return () => {
      Taro.eventCenter.off(`${props.identifier}-cb`);
    }
  }, [props.identifier, list]);

  // useEffect(() => {console.log(new VirList())}, [])
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
    if (vrKey && list.length && isReady) {
      if (!isLast.current) {
        // throttle(() => {
        // }, 300)
        // console.log([preIndex.current, startIndex + spaceCount])
        let lastIndex = startIndex + spaceCount
        lastIndex = lastIndex > list.length ? list.length : lastIndex;
        tool.callMySon(vrKey,[preIndex.current, lastIndex])
      }
      isLast.current = !(startIndex + visibleCount <= list.length-1)
    }
  }, [list, startIndex, vrKey, isReady]);


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