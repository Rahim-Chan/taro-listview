import Taro, {useState} from '@tarojs/taro';
import {View, Button} from '@tarojs/components';
import {Skeleton} from 'components';
import './index.scss'

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
                    <View className='avatar skeleton-radius'/>
                    <View className='title skeleton-rect'>
                      123456789
                    </View>
                    <View className='title skeleton-rect'>
                      123456789
                    </View>
                  </View>
              ))
            }
          </Skeleton>
        </View>
      </View>
  )
}
