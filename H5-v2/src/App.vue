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
      this.resetREM()
      this.resetWidth()
    }
    this.resetREM()
    this.resetWidth()
  },
  methods: {
    resetREM() {
      const html = document.getElementsByTagName('html')[0]
      html.style.fontSize = `${document.documentElement.clientHeight / 750 * 100}px`
    },
    resetWidth() {
      if (!/Android|webOS|iPhone|iPod/i.test(navigator.userAgent)) {
        const clientHeight = document.documentElement.clientHeight
        document.body.style.width = `${clientHeight / 1.7777777}px`
      }
    }
  }
}
</script>