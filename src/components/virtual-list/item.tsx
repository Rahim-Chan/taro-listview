import React from 'react';
import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";

function areEqual (preProps, nextProps) {
  return preProps.current === nextProps.current
}
interface Props {
  current: number;
  identifier?: number | string | undefined;
  height: number;
  top: number;
}

const Item: React.FunctionComponent<Props> = (props) => {
  return (
    <View style={{ position: 'absolute', border: '1px solid black', width: '100%',top: `${props.top}px`, height: `${props.height}px`}}>
      {props.children}
    </View>
  )
}

export default Taro.memo(Item,areEqual)
