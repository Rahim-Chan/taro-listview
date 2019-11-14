import Taro, { useState } from "@tarojs/taro";
import {View} from "@tarojs/components";
import { VirtualItem, VirtualList } from '../components/index';

const Page = () => {
  const [list, setList] = useState([])
  return (
    <View>
      <VirtualList
        list={list}
      >
        {
          list.map((i, index)=>{
            return (
              <VirtualItem
                current={index}
              >
                1
              </VirtualItem>
            )
          })
        }
      </VirtualList>
    </View>
  )
}
export default Page;