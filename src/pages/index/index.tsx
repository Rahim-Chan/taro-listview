import Taro, {Component} from '@tarojs/taro';
import {View, Image} from '@tarojs/components';
import ListView from '../../components/list-view';
import {wait} from 'utils/utils';
import './index.scss'


const blankList = []
const NUM_ROWS = 10;
let pageIndex = 1;

export default class Index extends Component {
  state = {
    isLoaded: false,
    error: false,
    hasMore: true,
    style: {},
    isEmpty: false,
    list: [],
  };

  getData = async (pIndex = pageIndex) => {
    if (pIndex === 1) this.setState({isLoaded: false})
    const { data: { data } } = await Taro.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data: {
        limit: 10,
        page: pIndex
      }
    })
    console.log({data})
    return {list : data, hasMore: true, isLoaded: pIndex === 1};
  };

  componentDidMount() {
    this.refList.fetchInit()
  }

  pullDownRefresh = async (rest) => {
    pageIndex = 1;
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
              style={{height: '100vh'}}
              isEmpty={isEmpty}
              onPullDownRefresh={fn => this.pullDownRefresh(fn)}
              onScrollToLower={this.onScrollToLower}
          >
            {list.map((item, index) => {
              return (
                  <View className='item skeleton-bg' key={index}>
                    <Image className='avatar skeleton-radius' src={item.author.avatar_url}/>
                    <View className='title skeleton-rect'>
                      {item.title}
                    </View>
                    <View className='skeleton-rect'>
                      {item.value}
                    </View>
                  </View>
              )
            })}
          </ListView>
        </View>
    )
  }
}
