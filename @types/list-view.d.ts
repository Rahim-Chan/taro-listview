import { ComponentClass } from 'react';

export interface Indicator {
  activate?: any,
  deactivate?: any,
  release?: any,
  tipFreedText?: any;
}
export interface Launch {
  launchEmpty?: boolean;
  launchError?: boolean;
  launchFooterLoading?: boolean;
  launchFooterLoaded?: boolean;
}

export interface AtListViewProps {
  style?: any;
  className?: string;
  emptyText?: string;
  footerLoadedText?: string;
  footerLoadingText?: string;
  noMore?: string;
  tipText?: string;
  tipFreedText?: string;
  onScrollToLower: (any) => void;
  onPullDownRefresh?: (any) => void;
  hasMore: boolean;
  needInit?: boolean;
  isEmpty: boolean;
  isError?: boolean;
  launch?: Launch;
  renderEmpty?: any;
  renderError?: any;
  renderFooterLoading?: any;
  renderFooterLoaded?: any;
  distanceToRefresh?: number;
  indicator?: Indicator;
  isLoaded?: boolean;
  selector?: string;
}

declare const AtListView : ComponentClass<AtListViewProps>

export default AtListView

