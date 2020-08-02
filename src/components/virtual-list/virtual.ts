import Taro from "@tarojs/taro";

type EventList = {
  [id: string] : {
    whoInShow: number[]
    readyNum: number;
  }
}
type Child = {
  [key: string]: any[];
}
export const rangeList: Child = {};
const eventList: EventList = {};

export const setRange = (key, range) => {
  rangeList[key] = range;
}
export const shouldChildShow = (key, current) => {
  if (!key) return false
  const [preIndex, endIndex] = rangeList[key] || [0,0];
  return current >= preIndex && current <= endIndex
};

export const setVisibleList = () => {

}
export const initVir = (id) => {
  Taro[`${id}-cb`] = Taro.eventCenter.trigger.bind(Taro.eventCenter, `${id}-cb`);
  // const vrKey = `vr${new Date().getTime()}`;
  eventList[id] = {
    whoInShow: [0, 0],
    readyNum: 0,
  }
  // registered(id, length)
  // return vrKey
};

export const registered = (id, length) => {
  Array(length).fill('1').forEach((_, index) => {
    Taro[`${id}-${index}`] = Taro.eventCenter.trigger.bind(Taro.eventCenter, `${id}-${index}`);
  })

}

export const childReady = (identifier, current) => {
  Taro[`${identifier}-cb`](current)
  eventList[identifier].readyNum += 1;
}

export const allChildReady = (identifier, length) => {
  return length === eventList[identifier].readyNum;
}

export const callMySon = (key, range) => {
  const { whoInShow } = eventList[key];
  const [rm, show] = diff([...whoInShow], range)
  eventList[key].whoInShow = range;
  rm.forEach(i => {
    Taro[`${key}-${i}`](false)
  })
  // if (!eventList[key]) return
  show.forEach(i => {
    Taro[`${key}-${i}`](true)
  })
}

const diff = (pre, next) => {
  if (!pre.length) return next
  const needShow: number[] = [];
  const needRm: number[] = [];
  const [preMin, preMax] = pre;
  const [nextMin, nextMax] = next;

  if (nextMin < preMin) {
    //向上滚动的趋势next小与pre
    for (let i = nextMin; i < preMin; i++) {
      //添加之前移除的元素
      needShow.push(i)
    }
    for (let i = nextMax; i < preMax; i++) {
      //移除之前添加的元素
      needRm.push(i)
    }
  } else {
    for (let i = preMin; i < nextMin; i++) {
      //我是前面移除的元素
      needRm.push(i)
    }
    for (let i = preMax; i < nextMax; i++) {
      //我是前面添加的元素
      needShow.push(i)
    }
  }

  return [needRm, needShow];
};

export default {
  height: 100,
  allChildReady,
  childReady,
  callMySon,
  shouldChildShow,
  setRange,
  initVir,
  setVisibleList
}