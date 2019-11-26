import Taro from "@tarojs/taro";

type Event = {
  id: string | number;
  key: string;
}

type Child = {
  [key: string]: any[];
}
export const rangeList: Child = {};
const eventList: Event[] = [];

export const setRange = (key, range) => {
  rangeList[key] = range;
}
export const shouldChildShow = (key, current) => {
  if (!key) return false
  const [preIndex, endIndex] = rangeList[key];
  return current >= preIndex && current <= endIndex
};

export const getEventKey = (id) => {
  const trKey = id || eventList.length - 1;
  const target = eventList[trKey];
  if (target) {
    return target.key
  }

}
export const setVisibleList = () => {

}
export const initVir = (id?) => {
  console.log('initVir')
  const vrKey = `vr${new Date().getTime()}`;
  eventList.push({
    id: id || new Date().getTime(),
    key: vrKey,
  });
  Taro[vrKey] = Taro.eventCenter.trigger.bind(Taro.eventCenter, `${vrKey}`);
  return vrKey
};

export default {
  shouldChildShow,
  setRange,
  getEventKey,
  initVir,
  setVisibleList
}