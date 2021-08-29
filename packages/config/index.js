import custom from './custom'
import input from './input'
import select from './select'
import inputNumber from './input-number'
import radio from './radio'
import checkbox from './checkbox'
import time from './time'
import date from './date'
import rate from './rate'
import color from './input-color'
import Switch from './switch'
import slider from './slider'
import font from './font'
import { KEY_COMPONENT_CONFIG_NAME } from '@/global/variable'
const components = [
  custom,
  input,
  select,
  inputNumber,
  radio,
  checkbox,
  time,
  date,
  rate,
  color,
  Switch,
  slider,
  font
]

const Config = {
  install (Vue) {
    if (this.installed) return
    this.installed = true

    components.map(component => {
      // 检查当前name是否有唯一标识,没有加上,确保注册组件唯一
      (typeof component.name === 'string' && !component.name.includes(KEY_COMPONENT_CONFIG_NAME))
        ? component.name = KEY_COMPONENT_CONFIG_NAME + component.name : ''
      Vue.component(component.name, component)
    })
  }
}

export default Config
