<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" class="router-view"></router-view>
      </keep-alive>
    </transition>

    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss">

#app {
  min-width: 23.4375rem;
  width: 23.4375rem;
  height: 100%;
}

.router-view {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all .3s ease;
}

.router-fade-enter-active, .router-fade-leave-active {
  opacity: 0;
  transform: translate3d(50% 0, 0);
}

.router-fade-enter, .router-fade-leave-active {
  opacity: 0;
  transform: translate3d(-50% 0, 0);
}

</style>
