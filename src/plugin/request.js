import qs from 'qs'
import http from 'axios'
import project from '@/project.config'
import { Toast, Notify } from 'vant'

http.defaults.timeout = 30000
http.defaults.headers.post['Content-Type'] = 'application/json'
http.defaults.headers.put['Content-Type'] = 'application/json'

const baseURL = project.BASE_URL
const escapeJsonContentType = 'application/x-www-form-urlencoded'
const methods = ['get', 'delete', 'head', 'jsonp', 'download', 'post', 'put', 'patch']
const methodsWidthBody = ['post', 'put', 'patch', 'delete']
let showLoading = true

function install (Vue, options) {
  let request = {}
  methods.forEach(method => {
    request[method] = getRequest(method)
  })

  // request封装
  function getRequest (method) {
    return function (url, data = {}, options = { baseURL, json: true, hasFile: false, headers: {}, loadingOpt: { show: true, message: '加载中...' } }) {
      showLoading = options.loadingOpt.show
      if (showLoading) {
        Toast.loading({
          message: options.loadingOpt.message
        })
      }

      Object.assign(options, { url, method })

      if (!options['headers']) {
        options['headers'] = {}
      }

      if (!options['baseURL']) {
        options['baseURL'] = baseURL
      }

      options['headers']['Content-Type'] = 'application/json'
      if (options['hasFile']) {
        options['headers']['Content-Type'] = 'multipart/form-data'
        let formData = new FormData()
        for (var key in data) {
          formData.append(key, data[key])
        }
        data = formData
      } else if (!options['json']) {
        // x-www-form格式处理
        options['headers']['Content-Type'] = escapeJsonContentType
        data = qs.stringify(data)
      }

      if (methodsWidthBody.includes(method)) {
        options['data'] = data
      } else {
        options['params'] = data
      }
      return http['request'](options).then(doResponse).catch(doError)
    }
  }

  // 响应处理
  function doResponse (res) {
    const { status, statusText, data = {} } = res
    if (showLoading) {
      Toast.clear()
    }
    if (status !== 200) {
      return Promise.reject(new Error(`[${status}]HTTP 请求失败: ${statusText}`))
    }
    if (data.status !== 200) {
      const { error_code: code = data.status, error_msg: msg = data.statusText } = data
      return Promise.reject(new Error(`[${code}]:${msg}`))
    }
    return data
  }

  // 异常处理
  function doError (error) {
    const { message = '发生未知异常' } = error || {}
    if (showLoading) {
      Toast.clear()
    }
    Notify('服务器正在维护')
    return Promise.reject(new Error(message))
  }

  Vue.$request = Vue.prototype.$request = request
}

export default {
  install
}
