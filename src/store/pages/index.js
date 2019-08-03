import Api from '@/interface/model_index'
// import Helper from '@/utils/helper'

let store = {
  namespaced: true,
  state: {
  },
  mutations: {
  },
  getters: {
  },
  actions: {
    async demoActions ({ state, dispatch }, param) {
      try {
        let res = await Api.getRecentList(param)
        if (res.data) {
          return res.data
        }
      } catch (e) {
        throw e
      }
    }
  }
}

export default store
