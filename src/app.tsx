import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import Index from './index'
import './app.scss';

/**
 * 异步加载外部 JavaScript
 */
function loadScript(url: string, callback: () => void, props?: { [key: string]: any }) {
  const script = document.createElement('script');
  script.onload = () => callback();
  script.src = url;
  if (props) {
    // eslint-disable-next-line
    for (const prop in props) {
      if (Object.prototype.hasOwnProperty.call(props, prop)) {
        script[prop] = props[prop];
      }
    }
  }
  document.body.appendChild(script);
}

if (Taro.getEnv() !== 'WEAPP') {
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/vConsole/3.3.4/vconsole.min.js', () => {
    // eslint-disable-next-line
    new VConsole();
  });
}

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config: Config = {
    pages: [
      'pages/index',
      'pages/index/index',
      'pages/index/lazy',
      'pages/skeleton/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
