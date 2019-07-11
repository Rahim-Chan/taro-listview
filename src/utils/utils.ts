let endTime: number;

export function throttle(callback: () => void, time: number = 500) {
  console.log('throttle');
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
