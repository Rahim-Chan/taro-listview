import React from 'react';
import { View } from '@tarojs/components';
import './app.scss';

export default function (props) {
  return (
    <View >{props.children}</View>
  )
}

