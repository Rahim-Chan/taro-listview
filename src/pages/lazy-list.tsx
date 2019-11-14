import Taro, {useState, useEffect, useMemo} from '@tarojs/taro';
import {View, ScrollView, Image} from '@tarojs/components';
import { throttle } from "../utils/utils";

const itemSize = {
  width: 100,
  height: 100,
}


const { windowHeight } = Taro.getSystemInfoSync();
let page = 0;
let cacheStartIndex = 0;
let preIndex = 0;
export default () => {
  const [list, setList] = useState([]);
  const [makeUpList, setMUList] = useState([]);
  const [startIndex, setStartIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0);
  const [endIndex, setEndIndex] = useState(visibleCount + startIndex)
  const [totalHeight, setHeight] = useState();
  const [visibleList, setVisibleList] = useState([])

  const fetchList = async () => {
    page +=1
    const { data: { data } } = await Taro.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data: {
        limit: 10,
        page
      }
    })
    console.log({ data })
    setList(list.concat(data))
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleLower = () => {
    throttle(() => {
      console.log('handleLower')
      fetchList()
    }, 500)
  }

  useEffect(() => {
    let index = startIndex;
    if (index > 2) {
      index -= 2
    } else {
      index = 0
    }
    preIndex = index;
    // console.log(cacheStartIndex)
    // if (cacheStartIndex + visibleCount >= list.length && list.length) {
    //   throttle(() => {
    //     setTimeout(() => {
    //       console.log('handleLower')
    //       fetchList()
    //     }, 500)
    //   }, 500)
    // }
  }, [startIndex]);

  useEffect(() => {
    setVisibleList(makeUpList.slice(preIndex, endIndex))
  }, [startIndex, endIndex, makeUpList]);

  useEffect(() => {
    setEndIndex(startIndex + visibleCount + 2)
  }, [startIndex, setEndIndex, visibleCount]);

  useEffect(() => {
    setVisibleCount(Math.ceil(windowHeight / itemSize.height))
  }, []);
  //
  useEffect(() => {
    if (!list.length) return;
    setHeight(list.length * itemSize.height + 'px')
    const temList = list.map((item, index) => {
      return {
        ...item,
        height: itemSize.height,
        top: (index)*itemSize.height,
        bottom:(index + 1) * itemSize.height,
        index: index
      }
    })
    setMUList(temList)
  }, [list]);

  const binarySearch = (list,value) => {
    const index = list.findIndex(i => i && i.bottom > value);
    setStartIndex(index)
    cacheStartIndex = index;
  };

  const handleScroll = (e) => {
    const { detail: { scrollTop }} = e;
    binarySearch(makeUpList, scrollTop)
  }

  return (
    <ScrollView
      style={{ height: '100vh' }}
      className="recycleWrap"
      scrollY
      onScroll={handleScroll}
      lowerThreshold={0}
      onScrollToLower={handleLower}
    >
      <View className="recycleItem list" style={{ height: totalHeight }}>
        <View className='recycleScreen'>
          {
            visibleList.map((i: any) => (
              <View style={{ height: `${i.height}px`, top: `${i.top}px`}} key={i.id} className="recycleItem">
                <View className='item'>
                  <Image className='avatar' src={i.author.avatar_url} />
                  <View>
                    {i.index}
                    <View className='title'>
                      {i.title}
                    </View>
                    <View className='title'>
                      {i.id}
                    </View>
                  </View>
                </View>
              </View>
            ))
          }
        </View>
      </View>

    </ScrollView>
  )
}