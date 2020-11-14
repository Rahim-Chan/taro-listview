# FAQ

## 下拉加载不能开启；
- 需要给组件设置一个固定高度
- onPullDownRefresh需要传入

## 字体样式在H5到时候字号变形；
taro2.x 版本请配置config文件；
```jsx
 h5: {
     esnextModules: ['taro-listview'],
}
```
