<template>
  <div class="appcontent">
    <div class="router">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="less">
#app {
  width:  100%;
  height:  100%;
}
.appcontent {
  width:  100%;
  height:  100%;
  .router {
    width: 100%;
    height: 100%;
  }
}
</style>
