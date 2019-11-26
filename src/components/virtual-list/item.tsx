import Taro, {useEffect, useState, useMemo, useRef} from "@tarojs/taro";
import {View} from "@tarojs/components";
import tools from './virtual';

interface Props {
  children: any;
  current: number;
  identifier?: number | string | undefined;
  height: number;
}

const Item: Taro.FunctionComponent<Props> = (props) => {
  const { identifier, current } = props;
  // const [canIShow, setCan] = useState(false);
  const key = useMemo(() => {
    return tools.getEventKey(identifier)
  }, [identifier]);

  //
  // useEffect(() => {
  //   const key = tools.getEventKey(identifier) as string;
  //   setCan()
  // }, [current, identifier]);
  // //
  // useEffect(() => {
  //   const key = tools.getEventKey(identifier) as string;
  //   Taro.eventCenter.on(key, res => {
  //     const [preIndex, endIndex] = res;
  //     const status = current >= preIndex && current<= endIndex;
  //     console.log({ current, status, canIShow})
  //     setCan(status)
  //   });
  //   return () => {
  //
  //     Taro.eventCenter.off(key);
  //   }
  // }, [current, identifier, canIShow]);
  if (tools.shouldChildShow(key, current)) {
    return (
      <View style={{ height: '100px', position: 'absolute', top: `${(current*100)}px` }}>
        {props.children}
      </View>
    )
  }
}

export default Item