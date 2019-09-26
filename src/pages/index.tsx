import Taro, {Component} from '@tarojs/taro';
import {View, Button} from '@tarojs/components';

export default class Index extends Component {
  route = (url) => {
    Taro.navigateTo({
      url: `/pages${url}`
    })
  }

  render() {
    return (
        <View>
          <Button className='button' onClick={() => this.route('/index/index')}>长列表(上下拉，懒加载，骨架屏)</Button>
          <Button className='button' onClick={() => this.route('/index/lazy')}>长列表（懒加载）</Button>
          <Button className='button' onClick={() => this.route('/skeleton/index')}>骨架屏</Button>
        </View>
    )
  }
}
