import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';

interface PagePros {
    color?: any;
}
class Page extends Component<PagePros> {
    render() {
        return (
            <View className='loading-box' data-color='red'>
                <View style='width:100%;height:100%' className='lds-rolling'>
                    <View className='circle' style={{ borderColor: this.props.color }} />
                    {/*<View className='circle-gap'/>*/}
                </View>
            </View>
        )}
}

export default Page;
