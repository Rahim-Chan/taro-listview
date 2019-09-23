import Taro from '@tarojs/taro';
import storage  from "utils/storage";

const {windowHeight} = Taro.getSystemInfoSync();
const query = Taro.getEnv() === 'WEB' ? '.lazy-image' : '.lazy-view >>> .lazy-image'

export function debounce(method, time = 500) {
    let timer = null;
    return function() {
        const context = this;
        // 在函数执行的时候先清除timer定时器;
        // @ts-ignore
        clearTimeout(timer);
        // @ts-ignore
        timer = setTimeout(function() {
            method.call(context);
        }, time);
    };
}


const wait = function(time = 500) {
    return new Promise(res => {
        setTimeout(() => {
            res();
        }, time);
    });
};

function lazyScrollInit() {
  const lazyKey = `lazy${new Date().getTime()}`
  const lazyKeys = storage.get('lazyKeys',[])
  lazyKeys.push(lazyKey)
  storage.set('lazyKeys', lazyKeys)
  return lazyKey
}
function lazyScroll(key) {
    debounce(() => {
        Taro.createSelectorQuery()
            .selectAll(query)
            .boundingClientRect()
            .exec(res => {
                const list = res[0];
                console.log({ list })
                const indexs = [];
                list.forEach((i, index) => {
                    if (i.top > - windowHeight && i.top < windowHeight + 200) {
                        // @ts-ignore
                        indexs.push(index);
                    }
                });
                // @ts-ignore
                Taro[key](indexs)
            });
    }, 1000)()
}
export default { lazyScroll, wait, debounce, lazyScrollInit }