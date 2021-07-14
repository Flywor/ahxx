<template>
  <router-view />
</template>
<script lang="ts">
export default {
  data() {
    return {}
  },
  mounted() {
    this.$loading.hide()
    window.onresize = () => {
      this.resetWidth()
    }
    this.resetWidth()
  },
  methods: {
    resetWidth() {
      if (!/Android|webOS|iPhone|iPod/i.test(navigator.userAgent)) {
        const clientHeight = document.documentElement.clientHeight
        document.body.style.width = `${clientHeight / 1.7777777}px`
      }
    }
  }
}
</script>

<style lang="less">
* { padding: 0; margin: 0; list-style: none; box-sizing: border-box; }
html,
body {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  transition: width .3s;
}
#app {
  height: 100%;
  width: 100%;
  display: flex;
  background-color: #0D1117;
  transition: background-color .3s;
}
</style>
