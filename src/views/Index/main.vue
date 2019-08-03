<template>
  <div class="index__container">
    <ul>
      <li v-for="item in recentListData.list" :key="JSON.stringify(item)">{{ item.companyName }}</li>
    </ul>

    <van-button type="danger" @click="dialog">警告按钮</van-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { cloneDeep } from '@/libs/lodash'

export default {
  data () {
    return {
      recentListData: {
        hasMore: false,
        list: [],
        page: 0,
        size: 20,
        total: 0
      }
    }
  },

  methods: {
    ...mapActions({
      demoActions: 'index/demoActions'
    }),

    async loadRecentListData () {
      try {
        let config = {
          page: this.recentListData.page + 1,
          size: 20
        }
        let _res = await this.demoActions(config)
        let res = cloneDeep(_res)
        this.recentListData.hasMore = res.hasMore
        this.recentListData.page = res.page
        this.recentListData.list = [...res.list, ...this.recentListData.list]
        this.recentListData.total = res.total
      } catch (e) {
        throw e
      }
    },

    dialog () {
      this.$dialog({ message: '提示' })
    },

    init () {
      this.loadRecentListData()
    }
  },

  mounted () {
    this.init()
  }
}
</script>
