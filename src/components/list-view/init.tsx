export const initialState = {
  hideInd: false,
  touchScrollTop: 0,
  scrollTop: 0,
  startY: 0,
  downLoading: false,
  lowerLoading: false,
  // needPullDown: true,
  isInit: false,
  blockStyle: {
    transform: 'translate3d(0,0,0)',
    transition: 'none',
  },
  dampText: '',
};

export const initialProps ={
  lazy: false,
  distanceToRefresh: 50,
  damping: 150,
  isLoaded: true,
  isEmpty: false,
  emptyText: '',
  noMore: '暂无更多内容',
  footerLoadingText: '加载中',
  footerLoadedText: '暂无更多内容',
  scrollTop: 0,
  touchScrollTop: 0,
  onScrollToLower: () => {
  },
  showIndicator: true,
  className: '',
  onPullDownRefresh: null,
  hasMore: false,
  needInit: false,
  isError: false,
  launch: {},
  renderEmpty: null,
  renderError: null,
  indicator: {
    activate: '下拉刷新',
    deactivate: '释放刷新'
  }
};
