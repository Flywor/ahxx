<template>
  <button
    class="button"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts">
export default {
  name: 'Button',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.button {
  width: 100%;
  border: 0;
  border-radius: 3px;
  font-size: .16rem;
  padding: .08rem 0;
  background: #0351b1;
}
</style>
