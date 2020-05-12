import Taro, {Component} from '@tarojs/taro';
import {View, Image} from '@tarojs/components';
import ListView from '../../components/list-view';
import LazyBlock from '../../components/list-view/block';

let pageIndex = 1;

export default class Index extends Component {
  state = {
    hasMore: true,
    list: [],
  };



  componentDidMount = async () => {
    const res = await this.getData()
    this.setState(res)
  }

  getData = async (pIndex = pageIndex) => {
    const { data: { data } } = await Taro.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data: {
        limit: 10,
        page: pIndex
      }
    })
    return {list : data, hasMore: true };
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

  render() {
    const {hasMore, list} = this.state;
    return (
      <View className='lazy-view'>
        <ListView
          lazy
          hasMore={hasMore}
          style={{height: '100vh'}}
          onScrollToLower={this.onScrollToLower}
          lazyStorage='lazy'
        >
          {list.map((item, index) => {
            return (
              <View className='item' key={`item${index}`}>
                <LazyBlock current={index} className='avatar' lazyStorage='lazy'>
                  <Image className='avatar' src={item.author.avatar_url} />
                </LazyBlock>
                <View className='title'>
                  {item.title}
                </View>
              </View>
            )
          })}
        </ListView>
      </View>
    )
  }
}