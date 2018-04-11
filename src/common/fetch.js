/**
 * 基于 vue-resouce 的异步请求封装
 *   以提供 日志打印、错误处理、方法判断、统一请求参数类型、设置Loading状态 等功能
 * 调用示例：
 *   import Api from '../api'
 *   Api.getWxConfig(config).then(res => {}).catch(e => {})
 *
 * 参数说明：
 * config [Object]:
 *  config.data [Object] 请求的数据，统一为 JSON 对象
 *  config.logger [Boolean] 是否打印日志 默认 false
 *  config.catchError [Boolean] 是否捕捉错误并显示错误消息
 *  config.loading [Boolean] 全屏的 loading 状态，默认 true, 配置 stateName 后将失效
 *  config.urlData [Array] 请求地址中要拼接的参数对象，拼接顺序为数组顺序 例 xx/user/${id}/${name}
 *  config.stateName [String] 请求过程中需要更新的 loadding 状态名称 （需要 context 配置）
 *  config.context [Object] 当前页面实例 this （当配置了 stateName 时，context 必填）
 *  config.options [Object] vue-resource 的额外配置 如 {emulateJSON: true}
 */
import Vue from 'vue'
const keys = Object.keys

const INFO_COLOR = 'color: #47A86C'
const ERROR_COLOR = 'color: #FC6969'

const IS_PRODUCTION = window.location.href.indexOf('mytijian.com') > -1

const createAsyncRequest = apiConfig => {
  // 将每个业务 api 地址转为方法
  keys(apiConfig).forEach(v => {
    const urlInfo = apiConfig[v].split(' ')

    const method = urlInfo[0].toLowerCase()
    const isGet = method === 'get'

    // 请求参数处理
    apiConfig[v] = (config = {}) => {
      const {
        data = {}, context = null, loading = true, catchError = true,
        options = { emulateJSON: false }, stateName = '', urlData = [],
      } = config

      let { logger = true } = config

      console.log(config)

      // 线上环境不打印日志
      if (IS_PRODUCTION) logger = false

      const Message = Vue.prototype.$Message
      const Spin = Vue.prototype.$Spin

      // stateName 与 context 必需同时存在
      if (stateName && !context) throw new Error('[fetch.js warn]: context is requred!')

      // 拼接URL
      let url = urlInfo[1]
      if (urlData.length) url = `${url}/${urlData.join('/')}`

      //  处理 get请求参数
      if (isGet && keys(data).length) options.params = data

      // 设置 loading 状态
      stateName ? (context[stateName] = true) : (loading && Spin.show())

      // 日志 打印
      logger && console.log('%c============================= S', INFO_COLOR)
      logger && console.log('%c请求地址: ', INFO_COLOR, url)
      logger && console.log('%c请求参数: ', INFO_COLOR, data)

      // 返回 Promise对象
      return Vue.http[method](url, isGet ? options : data, !isGet && options).then(res => {
        logger && console.log('%c响应成功：', INFO_COLOR, res.body)
        logger && console.log('%c============================= E', INFO_COLOR)
        stateName ? (context[stateName] = false) : (loading && Spin.hide())
        return res.body
      }).catch(e => {
        logger && console.log('%c响应失败：', ERROR_COLOR, e)
        logger && console.log('%c============================= E', INFO_COLOR)
        // 显示 异常消息
        catchError && Message.error(e && e.text || '服务器繁忙')
        stateName ? (context[stateName] = false) : (loading && Spin.hide())
        throw e
      })
    }
  })
  return apiConfig
}

export default createAsyncRequest
