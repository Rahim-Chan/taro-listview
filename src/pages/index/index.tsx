import React from 'react';
import Taro from '@tarojs/taro';
import {View, Button} from '@tarojs/components';

export default function () {
  const route = (url) => {
    Taro.navigateTo({
      url: `/pages${url}`
    })
  }
  return (
    <View>
      <Button className='button' onClick={() => route('/index/index')}>长列表(上下拉，懒加载，骨架屏)</Button>
      <Button className='button' onClick={() => route('/index/lazy')}>长列表（懒加载）</Button>
      <Button className='button' onClick={() => route('/skeleton/index')}>骨架屏</Button>
    </View>
  )
}
