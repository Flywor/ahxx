<template>
  <router-view />
</template>
<script lang="ts">
export default {
  data() {
    return {
      isMobile: /Android|webOS|iPhone|iPod/i.test(navigator.userAgent)
    }
  },
  mounted() {
    this.$loading.hide()
  }
}
</script>