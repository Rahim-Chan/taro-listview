import Taro, {useEffect, useState} from "@tarojs/taro";
import {View} from "@tarojs/components";
import { VirtualItem, VirtualList } from '../components/index';

let page = 0;

const Page = () => {
  const [list, setList] = useState([])
  const fetchList = async () => {
    page +=1
    const { data: { data } } = await Taro.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data: {
        limit: 20,
        page
      }
    })
    setList(list.concat(data))
  }

  useEffect(() => {
    fetchList()
  }, []);

  return (
    <View>
      <VirtualList
        identifier='foo'
        onScrollToLower={fetchList}
        list={list}
      >
        {
          list.map((i, index)=>{
            return (
              <VirtualItem
                identifier='foo'
                key={index}
                current={index}
                height={100}

              >
                <View style={{ fontSize: 18 }}>
                  {i.title}{index}
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