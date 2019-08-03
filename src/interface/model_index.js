import Vue from 'vue'

export default class Api {
  /**
   * 相关接口
   * @static
   * @url
   * @param { }
   * @options  { baseURL, json: true, hasFile: false, headers: {}, loadingOpt: { show: true, message: '加载中...' } }
   */
  static getRecentList = (params) => {
    return Vue.$request.get('/company/get_recent_list', params, { loadingOpt: { show: false, message: 'moling...' } })
  }
}
