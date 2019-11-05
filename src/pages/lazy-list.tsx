import Taro, {useState, useEffect, useMemo} from '@tarojs/taro';
import {View, ScrollView, Image} from '@tarojs/components';

const initList = []
for (let i = 0; i < 30 ; i++) {
  initList.push({
    name: i,
    id: i,
    width: 100,
    height: 100,
  })
}
const itemSize = {
  width: 100,
  height: 100,
}


const { windowHeight } = Taro.getSystemInfoSync();
export default () => {
  const [list, setList] = useState(initList);
  const [startIndex, setStartIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0);
  const [endIndex, setEndIndex] = useState(visibleCount + startIndex)
  const [totalHeight, setHeight] = useState();
  const [visibleList, setVisibleList] = useState([])
  const [startOffset, setOffset] = useState(0);

  const positions = useMemo(() => {
    return list.map((_,index)=>{
      const { height } = itemSize;
      return {
        index,
        height,
        top:index * height,
        bottom:(index + 1) * height
      }
    })
  }, [list])

  useEffect(() => {
    setVisibleList(list.slice(startIndex, endIndex))
  }, [startIndex, endIndex]);

  useEffect(() => {
    setEndIndex(startIndex + visibleCount)
  }, [startIndex, setEndIndex, visibleCount]);

  useEffect(() => {
    setVisibleCount(Math.ceil(windowHeight / 100) + 10)
  }, []);
  //
  useEffect(() => {
    if (!list.length) return;
    setHeight(list.length * itemSize.height + 'px')
  }, list);

  const binarySearch = (list,value) => {
    const index  = list.findIndex(i => i && i.bottom > value);
    setStartIndex(index)
  };

  const handleScroll = (e) => {
    const { detail: { scrollTop }} = e;
    binarySearch(positions, scrollTop)
    setOffset(scrollTop - (scrollTop % 100))
  }


  return (
    <ScrollView style={{ height: '100vh' }} className="recycleWrap" scrollY onScroll={handleScroll}>
      <View className="recycleItem list" style={{ height: totalHeight }}/>
      <View style={{ transform: `translateY(${startOffset}px)`}} className='recycleScreen'>
        {
          visibleList.map(i => (
            <View style={{ height: `${i.height}px`}} key={i.height}>
              <View className='item'>
                <Image className='avatar' src='' />
                <View>
                  <View className='title'>
                    {i.name}
                  </View>
                  <View className='title'>
                    {i.name}
                  </View>
                  <View className='title'>
                    {i.name}
                  </View>
                </View>
              </View>
            </View>
          ))
        }
      </View>

    </ScrollView>
  )
}