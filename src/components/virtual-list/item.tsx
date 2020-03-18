import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";
import vrTool from "./virtual";

function areEqual (preProps, nextProps) {
  return preProps.current === nextProps.current
}
interface Props {
  children: any;
  current: number;
  identifier?: number | string | undefined;
  height: number;
}

const Item: Taro.FunctionComponent<Props> = (props) => {
  const { current } = props;

  return (
    <View style={{ position: 'absolute', border: '1px solid black', width: '100%',top: `${props.top}px`, height: `${props.height}px`}}>
      {props.children}
    </View>
  )
}

export default Taro.memo(Item,areEqual)
