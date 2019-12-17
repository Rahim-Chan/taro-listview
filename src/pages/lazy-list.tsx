import Taro, {useEffect} from "@tarojs/taro";
import {View} from "@tarojs/components";
import { VirtualItem, VirtualList } from '../components/index';
import useList from '../components/virtual-list/hooksList';
import './index.scss'

let page = 0;

const Page = () => {
  const [list, {append}] = useList([]);
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
    const list = new Array(100).fill('').map((i, index) => index)
    // setDb(list)
    append(list)
  }

  useEffect(() => {
    fetchList()
  }, []);

  return (
    <View>
      <VirtualList
        identifier='foo'
        onScrollToLower={() => {console.log('onScrollToLower')}}
      >
        {
          list.map((i)=>{
            return (
              <VirtualItem
                identifier='foo'
                key={i.__index__}
                current={i.__index__}
                height={100}
              >
                <View style={{ fontSize: 18 }}>
                  {i.__index__}
                </View>
              </VirtualItem>
            )
          })
        }
      </VirtualList>
    </View>
  )
}
export default Page;