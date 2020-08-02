import {Dispatch, SetStateAction, useCallback, useRef, useState} from '@tarojs/taro';
import diff from './diff';
import vr from './virtual'

interface Methods<S> {
  append: Dispatch<SetStateAction<S>>
}
const screenNum = 7;
const screenPage = 3;
const moreNum = screenNum * screenPage;
let outSetList: Taro.Dispatch<Taro.SetStateAction<any[]>> = () => {};
let updateList: (scrollTop) => void = () => {
};

const UseList = (initData: any[] | (() => any[])): [any[], Methods<any>] => {
  if (!Array.isArray(initData)) throw new Error('初始值必须为数组');
  const [list, setList] = useState([]);
  const setHeightRef = useRef(null)
  const pureList = useRef(initData)
  //list的完整版带有定位信息
  const cacheList = useRef({ list: [], beginIndex:0 , endIndex: 0 })

  const append = (newData) => {
    pureList.current = list.concat(newData).map((i, y) => {
      return {
        ...i,
        __index__: y,
        bottom: (y + 1) * vr.height,
      }
    });
    // setList(newList);
    setTimeout(() => {
      if (setHeightRef.current !== null) {
        setHeightRef.current(pureList.current.length * vr.height + 'px')
      }
    }, 300)
    ctx.updateList(0)
  };

  ctx.updateList = useCallback((scrollTop) => {
    const rectList = pureList.current;
    const start = rectList.findIndex(i => i && i.bottom > scrollTop);
    let lastIndex = start + moreNum;
    lastIndex = lastIndex > rectList.length ? rectList.length : lastIndex;
    let index = start;
    if (index >= moreNum) {
      index -= moreNum
    } else {
      index = 0
    }
    const newList = rectList.slice(index, lastIndex);
    const showList = diff(cacheList.current, newList);
    setList(showList.list);
    //cache list and next will be oldx
    cacheList.current = showList
  }, []);

  ctx.calcHeight = (setHeight) => {
    setHeightRef.current = setHeight;
  }
  return [list, {append}]
};

export const ctx = {
  outSetList,
  updateList,
};
export default UseList
