import Taro, {useState, useEffect, useRef } from '@tarojs/taro';
import {View, ScrollView} from '@tarojs/components';
import { throttle } from "../../utils/utils";
import {ctx} from './hooksList';
import tool, {registered} from "./virtual";

interface Props {
  children?: any;
  list: any[];
  identifier?: string | number;
  onScrollToLower?: () => void;
}
const itemSize = {
  width: 100,
  height: tool.height,
}
const { windowHeight } = Taro.getSystemInfoSync();
let visibleCount = 0;
let spaceCount = 0;
const spaceStep = 2;
const VirList: Taro.FunctionComponent<Props>= (props) => {
  const isLast = useRef(false);
  const preIndex = useRef(0);
  const [vrKey] = useState(props.identifier);
  const id = useRef(props.identifier)
  const { list = [], onScrollToLower } = props;
  const [makeUpList, setMUList] = useState([{ bottom: 0 }]);
  const [startIndex, setStartIndex] = useState(0)
  const [totalHeight, setHeight] = useState();
  const [isReady, getReady] = useState(false)
  const handleLower = () => {
    throttle(() => {
      // fetchList()
      getReady(false)
      if(onScrollToLower) onScrollToLower()
    }, 800)
  }

  useEffect(() => {
    // 初始化
    tool.initVir(props.identifier)
  }, [props.identifier])

  useEffect(() => {
    if (list.length) {
      //注册子元素监听器
      registered(props.identifier, list.length);
      //判断子元素是否就位（两种方法）
      //小程序环境下（子元素先粗发）
      // console.log(tool.allChildReady(props.identifier, list.length), 'isReady')
      getReady(tool.allChildReady(props.identifier, list.length))
      //h5环境下（父元素先触发）

      Taro.eventCenter.on(`${id.current}-cb`, nthSon => {
        if (nthSon === list.length - 1) {
          getReady(true)
        } else {
          getReady(false)
        }
      });
    }
    visibleCount = Math.ceil(windowHeight / itemSize.height);
    spaceCount = visibleCount + Math.ceil(visibleCount * spaceStep);
    return () => {
      Taro.eventCenter.off(`${id.current}-cb`);
    }
  }, [list.length, props.identifier]);

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
      isLast.current = !(startIndex + visibleCount <= list.length-1)
      if (!isLast.current) {
        // throttle(() => {
        // }, 300)
        // console.log([preIndex.current, startIndex + spaceCount])
        let lastIndex = startIndex + spaceCount
        lastIndex = lastIndex > list.length ? list.length : lastIndex;
        tool.callMySon(vrKey,[preIndex.current, lastIndex])
      }
    }
  }, [startIndex, vrKey, isReady, list.length]);


  //
  useEffect(() => {
    if (!list.length) return;
    setHeight(list.length * itemSize.height + 'px')
    const temList = list.map((_, y) => {
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
    <View>
      <View onClick={() => {
        console.log('ctx.outSetList([])')
        console.log(ctx)
        ctx.outSetList([])
      }}
      >ctx</View>
      <ScrollView
        style={{ height: '100vh' }}
        // className='recycleWrap'
        scrollY
        onScroll={handleScroll}
        lowerThreshold={20}
        onScrollToLower={handleLower}
      >
        <View id='foo' className='recycleList' style={{ height: totalHeight }}>
          {this.props.children}
        </View>
      </ScrollView>
    </View>

  )
}
export default VirList