import Taro, {useEffect, useState } from "@tarojs/taro";
import {View} from "@tarojs/components";

interface Props {
  children: any;
  current: number;
  identifier?: number | string | undefined;
  height: number;
}

const Item: Taro.FunctionComponent<Props> = (props) => {
  const { identifier, current } = props;
  const [canIShow, setCan] = useState(false);

  useEffect(() => {
    // console.log('cb', current)
    Taro[`${identifier}-cb`](current)
  }, [current, identifier]);
  useEffect(() => {
    // const key = tools.getEventKey(identifier) as string;
    Taro.eventCenter.on(`${identifier}-${current}`, status => {
      // console.log(status, current)
      setCan(status)
    });
    return () => {
      Taro.eventCenter.off(`${identifier}-${current}`);
    }
  }, [current, identifier]);
  if (canIShow) {
    return (
      <View style={{ height: '100px', position: 'absolute', top: `${(current*100)}px` }}>
        {props.children}
      </View>
    )
  }
}

export default Item