import React, { useState } from 'react';
import {View, Text, Button} from '@tarojs/components';
import {Skeleton} from 'components';

export default () => {
  const [isLoaded, setLoaded] = useState(false)
  return (
      <View>
        <Button onClick={() => setLoaded(!isLoaded)}>toggle</Button>
        <View className='skeleton'>
          <Skeleton isLoaded={isLoaded}>
            {
              Array(4).fill(1).map(i => (
                  <View className='item skeleton-bg' key={i}>
                    <View className='avatar skeleton-radius' />
                    <View>
                      <View className='title skeleton-rect'>
                        大多数教程把 React 称作是一个 UI 库。
                      </View>
                      <View className='title skeleton-rect'>
                        这是有道理的，因为 React 就是一个 UI 库。正如官网上的标语所说的那样。
                      </View>
                      <Text className='skeleton-rect'>
                        这是有道理的，因为 React 就是一个 UI 库。正如官网上的标语所说的那样。
                      </Text>
                    </View>

                  </View>
              ))
            }
          </Skeleton>
        </View>
      </View>
  )
}
