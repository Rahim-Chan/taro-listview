import Taro, {useEffect} from "@tarojs/taro";
import {View} from "@tarojs/components";
import { VirtualItem, VirtualList } from '../components/index';
import useList, { link } from '../components/virtual-list/use-list';
import './index.scss'

let page = 0;

const Page = () => {
  const [list, append] = useList('id');
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
                // height={i.__itemHeight__}
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
