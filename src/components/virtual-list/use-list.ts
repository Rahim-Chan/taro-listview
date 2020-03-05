import {useState, useEffect, useRef} from '@tarojs/taro';

export const link = {};

interface ListItem {
  __itemHeight__: number;
  __index__: number;
}

const UseList = (id: string) => {
  const [list, setList] = useState<ListItem[]>([]);//render in viewpoint
  const totalHeight = useRef(0);//height of contain
  const cacheList = useRef<ListItem[]>([]);//cache all data<ListItem[]>

  const renderList = (scrollTop) => {

  };

  const push = (d:any[]) => {
    //处理列表数据
    const data = d.map((i, index)=>{
      return {
        ...i,
        __index__: index
      }
    })
    cacheList.current = data
  };

  useEffect(() => {
    //初始化实例
    link[id] = push;
    //卸载
    return () => {
      link[id] = null;
    }
  }, [id]);

  return [list, push]
};

export default UseList
