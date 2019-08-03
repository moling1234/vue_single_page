import { Button, Dialog } from 'vant'
const vant = {
  install: function (Vue) {
    Vue.use(Button)
    Vue.use(Dialog)
  }
}
export default vant
