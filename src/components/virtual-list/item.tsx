import Taro, {useEffect, useState, useMemo} from "@tarojs/taro";
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
  const [range, setRange] = useState([]);
  const canIShow = useMemo(() => {
    if (range.length) {
      // @ts-ignore
      const [preIndex, endIndex] = range;
      return current >= preIndex && current<= endIndex
    } else {
      return true
    }
  }, [current, range]);
  useEffect(() => {
    const key = tools.getEventKey(identifier);
    // @ts-ignore
    Taro.eventCenter.on(key, res => {
      // rangeIndex.current = res;
      setRange(res)
    });
    return () => {
      Taro.eventCenter.off(key);
    }
  }, [identifier]);

  if (canIShow) {
    return (
      <View style={{ height: '100px', position: 'absolute', top: `${(current*100)}px` }}>
        {props.children}
      </View>
    )
  }
}

export default Item