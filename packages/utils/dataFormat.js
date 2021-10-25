/**
 * @program: loquat-form-design
 *
 * @description: 数据格式工具类,格式转换,数据分类,设置表单数据...
 *
 * @author: entfrm开发团队-王翔
 *
 * @create: 2021-07-15
 **/
import {
  ARRAY_VALUE_TYPES,
  KEY_COMPONENT_NAME,
  MULTIPLE_FEATURE_TYPES,
  RANGE_FEATURE_TYPES,
  SELECT_TYPES,
  NUMBER_VALUE_TYPES,
  BOOLEAN_VALUE_TYPES,
  REMOTE_REQUEST_TYPES,
  KEY_COMPONENT_CONFIG_NAME
} from '@/global/variable'
import { validateNull, setPx, deepClone, getObjType, randomId8, kebabCase } from './index'
import request from '@utils/request'
import packages from './packages'
import { hasOwnProperty } from '@/directive/hasPerm'
import { coralLayoutRowDeepClone } from '@utils/layout'
import { getToken } from '@utils/qiniuOss'

/** 获取控件默认提示 **/
export function getPlaceholder (item) {
  const label = item.label
  if (SELECT_TYPES.includes(item.type)) {
    return `请选择 ${label}`
  } else {
    return `请输入 ${label}`
  }
}

/** 获取标签长度 **/
export function getLabelWidth (column, item, defval) {
  let result
  if (!this.$loquat.validateNull(column.labelWidth)) {
    result = column.labelWidth
  } else if (!this.$loquat.validateNull(item.labelWidth)) {
    result = item.labelWidth
  }
  return setPx(result, defval)
}

/** 表单初始化默认模型设置prop **/
export function formInitVal (list = []) {
  const formModel = {}
  list.forEach(ele => {
    const plugin = ele.plugin || {}
    switch (ele.type) {
      // 珊瑚布局数据处理
      case 'coralLayout':
        ele.cols.forEach(col => {
          const deepModel = formInitVal(col.list)
          for (const [key, value] of Object.entries(deepModel)) formModel[key] = value
        })
        break
      // 插件数据处理
      default:
        if (ele.propExclude) break
        if (ARRAY_VALUE_TYPES.includes(plugin.type || ele.type) ||
          (MULTIPLE_FEATURE_TYPES.includes(ele.type) && plugin.multiple) ||
          (RANGE_FEATURE_TYPES.includes(ele.type) && plugin.range)
        ) {
          formModel[ele.prop] = []
        } else if (NUMBER_VALUE_TYPES.includes(ele.type)) {
          formModel[ele.prop] = 0
        } else if (BOOLEAN_VALUE_TYPES.includes(ele.type)) {
          formModel[ele.prop] = false
        } else {
          formModel[ele.prop] = ''
        }
        if (!validateNull(plugin.value)) {
          formModel[ele.prop] = plugin.value
        }
    }
  })
  return formModel
}

/** 清空表单值 **/
export function formClearVal (obj, list = []) {
  if (!obj) return {}
  Object.keys(obj).forEach(key => {
    if (validateNull(obj[key]) || list.includes(key)) return
    switch (getObjType(obj[key])) {
      case 'array':
        obj[key] = []
        break
      case 'object':
        obj[key] = {}
        break
      case 'number':
        obj[key] = 0
        break
      case 'boolean':
        obj[key] = false
        break
      default:
        obj[key] = ''
    }
  })
  return obj
}

/** 获取组件名称 **/
export function getComponent (type, component) {
  let result = type || 'input'
  if (!validateNull(component)) {
    return component
  } else if (['textarea', 'password'].includes(type)) {
    result = 'input'
  }
  return KEY_COMPONENT_NAME.concat(kebabCase(result))
}

/** 获取配置组件名称 **/
export function getComponentConfig (type, component) {
  let result = type || 'input'
  // 引入第三方组件打开自定义配置面板
  if (!validateNull(component)) {
    result = 'custom'
  } else if (['textarea', 'password'].includes(type)) {
    result = 'input'
  }
  return KEY_COMPONENT_CONFIG_NAME.concat(kebabCase(result))
}

/** 设计器配置转换设计器预览配置 **/
export function designTransformPreview (_this) {
  const data = deepClone(_this.option)
  const eventScript = data.eventScript
  const autoDataSource = data.dataSource && data.dataSource.filter(item => item.auto)
  handleDeepDesignTransformPreview(_this, data.column, {
    eventScript,
    autoDataSource
  })
  delete data.dataSource
  delete data.eventScript
  return data
}

/** 处理设计器配置转换设计器预览配置深度递归 **/
function handleDeepDesignTransformPreview (_this, column, ops = {}) {
  // 设置参数配置,为了后面好扩展单独提出来
  const options = {
    eventScript: ops.eventScript || [],
    autoDataSource: ops.autoDataSource || [],
    remoteOption: { ...pluginDefaultData(_this).remoteOption, ..._this.$loquat.remoteOption },
    remoteFunc: { ...pluginDefaultData(_this).remoteFunc, ..._this.$loquat.remoteFunc },
    axios: _this.$loquat.axios
  }
  for (let i = 0; i < column.length; ++i) {
    const col = column[i]
    const plugin = col.plugin || {}
    const validateConfig = col.validateConfig || {}
    switch (col.type) {
      // 珊瑚布局数据处理
      case 'coralLayout':
        for (let colIndex = 0; colIndex < col.cols.length; ++colIndex) {
          const coralCol = col.cols[colIndex]
          handleDeepDesignTransformPreview(_this, coralCol.list, {
            eventScript: ops.eventScript,
            autoDataSource: ops.autoDataSource
          })
        }
        break
      // 插件数据处理
      default:
        // 处理动作转换数据
        if (typeof col.events === 'string') {
          try {
            const execute = eval // 将this指向window
            const parse = execute('(' + col.events + ')')
            getObjType(parse) === 'object' ? col.events = parse : col.events = {}
          } catch (e) {
            col.events = {}
          }
        }
        for (const key in col.events) {
          if (col.events[key] && getObjType(col.events[key]) !== 'function') {
            const event = options.eventScript.find(item => item.name === col.events[key])
            col.events[key] = event && new Function(event.func)
          }
        }
        // 处理上传数据
        if (col.type === 'upload') {
          // 转换请求头部与请求参数数据格式
          plugin.headers = plugin.headers && Object(...plugin.headers.map(({ key, value }) => ({ [key]: value })))
          plugin.data = plugin.data && Object(...plugin.data.map(({ key, value }) => ({ [key]: value })))
          // 设置上传动作数据
          for (const key in col.events) col.events[key] ? plugin[key] = col.events[key] : ''
        }
        // 处理远端请求数据转换
        if (REMOTE_REQUEST_TYPES.includes(col.type)) {
          if (!col.remote) _this.$set(_this.DIC, col.prop, col.dicData)
          else {
            const dataSource = options.autoDataSource.find(item => item.key === col.remoteDataSource)
            // 提取请求参数
            const param = (({ url, method, headers, params }) => {
              return { url, method, headers, params }
            })(dataSource || {})
            // 插件中存在静态数据设置显示隐藏标签的,远端请求强制设置显示
            if (hasOwnProperty(plugin, 'showLabel')) plugin.showLabel = true
            switch (col.remoteType) {
              case 'option' :
                if (options.remoteOption[col.remoteOption]) _this.$set(_this.DIC, col.prop, options.remoteOption[col.remoteOption])
                break
              case 'func' :
                if (options.remoteFunc[col.remoteFunc]) _this.$set(_this.DIC, col.prop, options.remoteFunc[col.remoteFunc]())
                break
              case 'datasource' :
                if (!dataSource) break
                // 是否使用第三方Axios请求
                if (dataSource.thirdPartyAxios) {
                  !validateNull(options.axios) ? options.axios(param).then(res => {
                    try {
                      const execute = new Function('res', dataSource.responseFunc)(res)
                      _this.$set(_this.DIC, col.prop, remoteAccept(execute, col.type))
                    } catch (e) {
                      console.error(e)
                    }
                  }).catch(error => {
                    try {
                      const execute = new Function('error', dataSource.errorFunc)(error)
                      console.error(execute)
                    } catch (e) {
                      console.error(e)
                    }
                  }) : packages.logs('thirdPartyAxios')
                } else {
                  request.interceptors.request.empty()
                  dataSource.method !== 'GET' && request.interceptors.request.use(config => {
                    return new Function('config', dataSource.requestFunc)(config)
                  }, undefined)
                  request(param).then(res => {
                    try {
                      const execute = new Function('res', dataSource.responseFunc)(res)
                      _this.$set(_this.DIC, col.prop, remoteAccept(execute, col.type))
                    } catch (e) {
                      console.error(e)
                    }
                  }).catch(error => {
                    try {
                      const execute = new Function('error', dataSource.errorFunc)(error)
                      console.error(execute)
                    } catch (e) {
                      console.error(e)
                    }
                  })
                }
                break
            }
          }
        }
        // 校验规则处理
        if (getObjType(validateConfig) === 'object') {
          const rules = []
          validateConfig.required && rules.push({ required: true, message: validateConfig.requiredMessage || `${col.label}必须填写` })
          validateConfig.type && rules.push({ type: validateConfig.typeFormat, message: validateConfig.typeMessage || `${col.label}格式不正确` })
          validateConfig.pattern && rules.push({ pattern: validateConfig.patternFormat, message: validateConfig.patternMessage || `${col.label}格式不匹配` })
          col.rules = rules
        }
        clearTransformDirtyData(col)
    }
  }
}

/** 清除设计转换预览脏数据  **/
export function clearTransformDirtyData (column) {
  const plugin = column.plugin || {}
  // 清除动作转换数据
  if (getObjType(column.events) === 'object') {
    for (const key in column.events) !column.events[key] && delete column.events[key]
  } else delete column.events
  switch (column.type) {
    // 清除上传数据
    case 'upload':
      getObjType(column.events) === 'object' && delete plugin.headers
      getObjType(column.events) === 'object' && delete plugin.data
      delete column.events
      break
  }
  // 清除远端请求数据转换
  delete column.remote
  delete column.dicData
  delete column.remoteType
  delete column.remoteFunc
  delete column.remoteOption
  delete column.remoteDataSource
  // 清除校验规则处理数据
  delete column.validateConfig
}

/** 表单部件添加数据处理 **/
export function getWidgetAddData (data) {
  data = deepClone(data)
  delete data.icon
  switch (data.type) {
    // 珊瑚布局数据处理
    case 'coralLayout':
      data = coralLayoutRowDeepClone(data)
      break
    // 插件数据处理
    default:
      // todo: 处理不同插件属性又互不影响,可采用switch
      data.prop = randomIdentity(data.type)
  }
  return data
}

/** 表单部件克隆数据处理 **/
export function getWidgetCloneData (data) {
  data = deepClone(data)
  // todo: 处理不同插件属性又互不影响,可采用switch
  data.prop = randomIdentity(data.type)
  return data
}

/** 表单部件prop身份生成 **/
export function randomIdentity (type) {
  return (validateNull(type) ? '' : `${type}_`) + randomId8()
}

/** 处理响应数据数据是否受理,解决dic应对各种类型问题 **/
export function remoteAccept (data, type) {
  // 远程类型细粒化处理,类型具体参考REMOTE_REQUEST_TYPES
  switch (type) {
    case 'radio':
    case 'select':
    case 'checkbox':
    case 'cascader':
      if (getObjType(data) === 'array') return data
      else return []
    case 'upload':
      if (getObjType(data) === 'string') return data
      else return ''
  }
  return undefined
}

/** 设置插件的一些默认数据 **/
function pluginDefaultData (_this) {
  return {
    remoteOption: {
      optionDefault: [
        { value: '4399小游戏', label: '4399小游戏' },
        { value: '7k7k小游戏', label: '7k7k小游戏' },
        { value: '拇指玩小游戏', label: '拇指玩小游戏' }
      ]
    },
    remoteFunc: {
      funcDefault () {
        return [
          { value: '小白兔', label: '小白兔' },
          { value: '煎饼果子', label: '煎饼果子' },
          { value: '彩虹猫', label: '彩虹猫' }
        ]
      },
      funcGetToken () {
        if (!window.CryptoJS) {
          packages.logs('CryptoJS')
          return
        }
        const oss = _this.$loquat.qiniu
        return getToken(oss.ak, oss.sk, {
          scope: oss.bucket,
          deadline: new Date().getTime() + (oss.deadline || 1) * 3600
        })
      }
    }
  }
}
