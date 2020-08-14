import {useState, useCallback, useEffect, useRef} from 'react';
import diff from './diff';

interface UTILS {
  any?: {
    push: () => void;
    render: () => void;
    setProps: (key: any, value: any) => void;
    itemHeight: () => void | number | string;
    isMount: boolean;
    setMount: (boolean) => void,
  }
}
const screen = 4;
const listAmount = 6;
const totalAmount = screen * listAmount;
//挂载多个列表操作方法；
export const utils: UTILS = {

};

interface ListItem {
  __height__: number;
  __index__: number;
  __bottom__: number;
  __top__: number;
}

const UseList = (id: string) => {
  const [renderList, setList] = useState<ListItem[]>([]);//render in viewpoint
  const [, setIsMount] = useState<boolean>(false);//render in viewpoint
  const totalHeight = useRef(0);//height of contain
  const cacheList = useRef<ListItem[]>([]);//cache all data<ListItem[]>
  // const cacheScrollTop = useRef(0); //recode scrollTop of list
  const cacheViewPointData = useRef({
    beginIndex: 0,
    endIndex: totalAmount,
  })

  const getTotalHeight = () => {
    let height = 0;
    const {itemHeight} = utils[id];
    if (typeof itemHeight === "function") {
      // height = itemHeightFn + itemHeightFn + ....
      height = cacheList.current.reduce((total, item) => item.__height__ + total, 0)
    } else {
      // height = count * itemHeight (number)
      height = 100 * itemHeight;
    }
    return height
  };

  const render = (scrollTop) => {
    //更新时缓存数据
    const { beginIndex, endIndex } = cacheViewPointData.current
    const newListData = cacheList.current;
    const startIndex = newListData.findIndex(i => i && i.__bottom__ >= scrollTop);
    let comStartIndex = startIndex;
    if (comStartIndex >= listAmount) {
      comStartIndex -= Math.floor(listAmount/2)
    } else {
      comStartIndex = 0
    }
    //新显示EndIndex下标
    let newEndIndex = comStartIndex + totalAmount;
    //旧现实下标
    const oldAverageIndex = (beginIndex + endIndex) / 2;
    //新现实下标
    const newAverageIndex = (comStartIndex + newEndIndex) / 2;

    // console.log({
    //   '旧平均': oldAverageIndex,
    //   '新平均': newAverageIndex,
    //   'view最顶部下标':startIndex,
    //   'list下标': comStartIndex
    // })
    if (Math.abs(oldAverageIndex-newAverageIndex) <= listAmount && startIndex) return

    const oldData = {
      list: renderList,
      ...cacheViewPointData.current
    };
    const { list, ...viewpoint } = diff(oldData, newListData.slice(comStartIndex, newEndIndex))
    cacheViewPointData.current =  viewpoint
    console.log('updateList')
    // 渲染列表
    setList(list);
  };

  const makeupData = (d: any[]):ListItem[] => {
    const { itemHeight } = utils[id]
    const heightIsFn = typeof itemHeight === "function";
    let data;
    if (heightIsFn) {
      let preTotalHeight = totalHeight.current;
      data = d.map((i, index)=>{
        let __height__ = itemHeight(index)
        const item =  {
          ...i,
          __index__: index,
          __height__,
          __bottom__: preTotalHeight+__height__,
          __top__: preTotalHeight
        }
        preTotalHeight += __height__;
        return item
      })
    } else {
      data = d.map((i, index)=>{
        return {
          ...i,
          __index__: index,
          __height__: itemHeight,
          __bottom__: itemHeight*index,
          __top__: itemHeight*index
        }
      })
    }
    return data
  };

  const push = (d: any[]) => {
    //d: 新增的数据
    if (utils[id].isMount) {
      // 遍历注入__index__,__height__
      //更新缓存列表数据
      cacheList.current = makeupData(d);
      //更新高度
      const height = getTotalHeight();
      totalHeight.current = height;
      utils[id].setHeight(height)
      //渲染更新视图列表数据
      render(0)
    } else {
      setTimeout(() => {
        push(d)
      })
    }
  };

  const setMount = useCallback((status) => {
    setIsMount(status);
    utils[id].isMount = status;
  }, [id]);


  useEffect(() => {
    //初始化实例?保留该方法通过唯一Key供Vir组件内部调用
    utils[id] = {
      push,
      render,
      setProps(key, value) {
        this[key] = value;
      },
      setMount,

    };
    console.log('***tool-init***',id, utils[id])
    //卸载
    return () => {
      utils[id] = null;
    }
  }, [id, setMount]);


  return [renderList, push]
};

export default UseList
