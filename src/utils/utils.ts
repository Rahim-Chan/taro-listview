let endTime: number;

export function throttle(callback: () => void, time: number = 500) {
  const startTime = new Date().getTime();
  if (startTime - endTime > time || !endTime) {
    callback();
    endTime = startTime;
  }
}
export const wait = function(time = 500) {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, time);
  });
};

/**
 * 异步加载外部 JavaScript
 */
export function loadScript(url: string, callback: () => void, props?: { [key: string]: any }) {
  const script = document.createElement('script');
  script.onload = () => callback();
  script.src = url;
  if (props) {
    // eslint-disable-next-line
    for (const prop in props) {
      if (Object.prototype.hasOwnProperty.call(props, prop)) {
        script[prop] = props[prop];
      }
    }
  }
  document.body.appendChild(script);
}

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