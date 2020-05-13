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

export function isPromise(object){
  if(Promise && Promise.resolve){
    return Promise.resolve(object) == object;
  }else{
    throw "Promise not supported in your environment"
  }
}

export const minGetMore = async (self) => {
  const {onScrollToLower, hasMore, async} = self.props;
  const {lowerLoading} = self.state;
  if (hasMore && !lowerLoading && onScrollToLower) {
    self.setState({lowerLoading: true});
    if (!async) {
      onScrollToLower(() => {
        self.setState({lowerLoading: false});
      });
    } else {
      await onScrollToLower();
      self.setState({lowerLoading: false});
    }
  }
}
