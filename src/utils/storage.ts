import Taro from '@tarojs/taro';

function get<T = any>(key: string, defaultValue?: T): T {
  let value = Taro.getStorageSync(key);
  if (!value || value === ' ' || value === 'undefined' || value === 'null') {
    value = '';
  }
  return value ? JSON.parse(value) : defaultValue;
}

function set<T = any>(key: string, value: T): void {
  Taro.setStorageSync(key, JSON.stringify(value));
}

function remove(key: string): void {
  Taro.removeStorageSync(key);
}

function clear(): void {
  Taro.clearStorageSync();
}

export default {
  get,
  set,
  remove,
  clear,
};
