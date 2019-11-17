import Taro from "@tarojs/taro";

type Event = {
  id: string | number;
  key: string;
}
const eventList: Event[] = [];
export const getEventKey = (id) => {
  if (id) {
    return eventList[id].key
  } else {
    return eventList[eventList.length-1].key
  }
}
export const setVisibleList = () => {

}
export const initVir = (id?) => {
  const vrKey = `vr${new Date().getTime()}`;
  eventList.push({
    id: id || new Date().getTime(),
    key: vrKey,
  });
  Taro[vrKey] = Taro.eventCenter.trigger.bind(Taro.eventCenter, `${vrKey}`);
  return vrKey
};

export default {
  getEventKey,
  initVir,
  setVisibleList
}