import Taro, {Component} from '@tarojs/taro';
import {View, Image} from '@tarojs/components';
import {ListView} from 'components';
import { wait } from 'utils/utils';
import './index.scss'

const NUM_ROWS = 15;
let pageIndex = 1;

export default class Index extends Component {
  state = {
    isLoaded: false,
    error: false,
    hasMore: true,
    style: {},
    isEmpty: false,
    list: [{
      value: 0,
      avatar: require('./assets/avatar.jpg'),
      title: 'this is title'
    },{
      value: 0,
      avatar: require('./assets/avatar.jpg'),
      title: 'this is title'
    },{
      value: 0,
      avatar: require('./assets/avatar.jpg'),
      title: 'this is title'
    }],
  };

  getData = async(pIndex = pageIndex) => {
    if (pIndex === 1) this.setState({ isLoaded: false })
    const list = [];
    for (let i = 0; i < NUM_ROWS; i++) {
      list.push({
        value: i + (pIndex - 1) * NUM_ROWS,
        avatar: require('./assets/avatar.jpg'),
        title: 'this is title'
      });
    }
    await wait(1000)
    return {list, hasMore: pIndex < 2, isLoaded: pIndex === 1};
  };
  componentDidMount() {
    console.log('componentDidMount')
    this.refList.fetchInit()
  }

  onPullDownRefresh = async (rest) => {
    const res = await this.getData(1);
    this.setState(res);
    rest()
  };

  onScrollToLower = async (fn) => {
    const {list} = this.state;
    const {list: newList, hasMore} = await this.getData(++pageIndex);
    this.setState({
      list: list.concat(newList),
      hasMore
    });
    fn();
  };

  refList = {};

  insRef = (node) => {
    this.refList = node;
  };

  render() {
    const {isLoaded, error, hasMore, isEmpty, list} = this.state;
    return (
      <View className='skeleton'>
        <ListView
          ref={node => this.insRef(node)}
          isLoaded={isLoaded}
          isError={error}
          hasMore={hasMore}
          style={{ height: '100vh' }}
          isEmpty={isEmpty}
          renderEmpty={(
            <View>
              renderEmpty
            </View>
          )}
          launch={{
            launchEmpty: false,
            launchFooterLoading: true,
            launchFooterLoaded: false,
          }}
          renderFooterLoading={(
            <View style={{ padding: 20 }}>
              renderFooterLoading
            </View>
          )}
          renderFooterLoaded={(
            <View style={{ padding: 20 }}>
              renderFooterLoaded
            </View>
          )}
          indicator={{
              activate: '下拉刷新',
              deactivate: '释放刷新',
              release: '刷新中',
            }}
          onPullDownRefresh={fn => this.onPullDownRefresh(fn)}
          onScrollToLower={fn => this.onScrollToLower(fn)}
        >
          {list.map((item, index) => {
            return (
              <View className='item skeleton-bg' key={index}>
                <Image className='avatar skeleton-radius' src={item.avatar}/>
                <View className='title skeleton-rect'>
                  { item.title }
                </View>
                <View className='skeleton-rect'>
                  { item.value }
                </View>
              </View>
            )
          })}
        </ListView>
      </View>
    )
  }
}
