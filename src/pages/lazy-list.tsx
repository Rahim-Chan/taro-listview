import Taro, {useEffect, useMemo} from "@tarojs/taro";
import {View} from "@tarojs/components";
import { VirtualItem, VirtualList } from '../components/index';
import useList from '../components/virtual-list/use-list';
import './index.scss'

let page = 0;

const handleGetItemHeight = (index) => {
  return index%2 ? 50: 100
}

const Page = () => {
  const [list, append] = useList('id');
  const [list1, append1] = useList('id1');
  // const [dbList, setDb] = useState([]);
  const fetchList = async () => {
    page += 1;
    // const { data: { data } } = await Taro.request({
    //   url: 'https://cnodejs.org/api/v1/topics',
    //   data: {
    //     limit: 200,
    //     page
    //   }
    // })
    const data = new Array(100).fill('').map((i, index) => index)
    // setDb(list)
    // link['id']([1,2,])
    append(data)
    append1(data)
  }

  useEffect(() => {
    fetchList()
  }, []);

  return (
    <View>
      <VirtualList
        itemHeight={100}
        identifier='id'
        onScrollToLower={() => {console.log('onScrollToLower')}}
      >
        {
          list.map((i)=>{
            return (
              <VirtualItem
                identifier='id'
                key={i.__index__}
                current={i.__index__}
                height={i.__height__}
                top={i.__top__}
              >
                <View style={{ fontSize: 18 }}>
                  {i.__index__ + 1}
                </View>
              </VirtualItem>
            )
          })
        }
      </VirtualList>
     {/* <VirtualList
        identifier='id1'
        itemHeight={handleGetItemHeight}
        onScrollToLower={() => {console.log('onScrollToLower')}}
      >
        {
          list1.map((i)=>{
            return (
              <VirtualItem
                identifier='id1'
                key={i.__index__}
                current={i.__index__}
                height={i.__height__}
                top={i.__top__}
              >
                <View style={{ fontSize: 18 }}>
                  {i.__index__}
                </View>
              </VirtualItem>
            )
          })
        }
      </VirtualList>*/}
    </View>
  )
}
export default Page;
