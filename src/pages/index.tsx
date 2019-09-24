import Taro, {Component} from '@tarojs/taro';
import {View, Button} from '@tarojs/components';
import './index.scss'

export default class Index extends Component {
  route = (url) => {
    Taro.navigateTo({
      url: `/pages${url}`
    })
  }

  render() {
    return (
        <View>
          <Button className='button' onClick={() => this.route('/index/index')}>PullDown & LowerMore</Button>
          <Button className='button' onClick={() => this.route('/index/lazy')}>LazyView</Button>
          <Button className='button' onClick={() => this.route('/skeleton/index')}>Skeleton</Button>
        </View>
    )
  }
}
