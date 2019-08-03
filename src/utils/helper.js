/* eslint-disable */
import _ from 'lodash'
import project from '@/project.config.js'
import storage from '@/libs/storage.js'

var isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);

class Helper {
  static isIE = () => {
    let userAgent = navigator.userAgent
    if (userAgent.indexOf('Edg') || userAgent.indexOf('Trident')) {
      return true
    }
    return false
  }

  static isIphoneX = () => {
    var u = navigator.userAgent
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    if (isIOS && ((screen.height === 812 && screen.width === 375) || (screen.height === 896 && screen.width === 414))) {
      return true
    }
    return false
  }

  static isMobile = () => {
    return isMobile
  }

  static isPc = () => {
    return !isMobile
  }

  static isPC = () => {
    return this.getPlatForm() === 'PC'
  }

  static isIOS = () => {
    return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  }

  static isAndroid = () => {
    var u = navigator.userAgent
    return !!(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1)
  }

  static isWeixin = () => {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) === 'micromessenger') {
      return true
    }
    return false
  }

  static isInHybirdApp = () => {
    try {
      var u = navigator.userAgent

      if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        if(window.android['UserLoginAction']){
          return true;
        }
      } else if(u.indexOf('iPhone') > -1) {
        if(window.webkit.messageHandlers['UserLoginAction']){
          return true;
        }
      }
    } catch (e) {
    }

    return false
  }

  static getPlatForm = () => {
    var userAgentInfo = navigator.userAgent
    var Agents = ['Android', 'IOS', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    
    if (!!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      return 'ios'
    }

    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.toLowerCase().indexOf(Agents[v].toLowerCase()) > 0) {
        return Agents[v]
      }
    }

    return 'PC'
  }

  static isMiniProgram = () => {
    const ua = window.navigator.userAgent.toLowerCase()
    return new Promise((resolve) => {
      if (ua.indexOf('micromessenger') === -1) { // 不在微信或者小程序中
        resolve(false)
      } else {
        wx.miniProgram.getEnv((res) => {
          if (res.miniprogram) { // 在小程序中
            resolve(true)
          } else { // 在微信中
            resolve(false)
          }
        })
      }
    })
  }

  static getIndexPageName = () => {
    return location.pathname.substr('1')
  }

  static getWeixinVersion = () => {
    var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)
    return wechatInfo
  }

  static isWeixinWork = () => {
    var ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('wxwork') >= 0) {
      return true
    }
    return false
  }

  static getUrlParams = () => {
    var quire = ''
    quire = location.search.substring(1).replace('/', '')
    quire = quire.replace(/\+/g, '%20')
    var arg = {}
    var pair = quire.split('&')
    if (pair.length > 0) {
      for (var i = 0; i < pair.length; i++) {
        var pos = pair[i].indexOf('=')
        if (pos === -1) continue
        var argName = pair[i].substring(0, pos)
        var argValue = pair[i].substring(pos + 1)
        try {
          argValue = decodeURIComponent(argValue)
        } catch(e) {
        }
        arg[argName] = argValue
      }
    } else {
      var de = quire.indexOf('=')
      if (de !== -1) {
        argName = pair[i].substring(0, de)
        argValue = pair[i].substring(de + 1)
        try {
          argValue = decodeURIComponent(argValue)
        } catch (e) {
        }
        arg[argName] = argValue
      }
    }
    return arg
  }

  // static setDocumentTitle = (text) => {
  //   var $body = $('body')
  //   document.title = text
  //   if(this.isWeixin()){
  //     var $iframe = $("<iframe style='display:none;' src='/favicon.ico'></iframe>")
  //     $iframe.on('load', function () {
  //       setTimeout(function () {
  //         $iframe.off('load')
  //         $iframe.remove()
  //       }, 0)
  //     }).appendTo($body)
  //   }
  // }

  static requestFullScreen = () => {
    var de = document.documentElement
    if (de.requestFullscreen) {
      de.requestFullscreen()
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen()
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen()
    }
  }

  static exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    }
  }
}

/* eslint-disable no-new */
