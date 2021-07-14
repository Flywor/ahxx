<template>
  <input
    class="input"
    v-bind="$attrs"
    :value="value"
    @input="$emit('update:value', $event.target.value)"
  />
</template>
<script lang="ts">
export default {
  name: 'Input',
  props: {
    value: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.input {
  padding: .08rem;
  border: 1px solid @font-color;
  border-radius: 3px;
  background: transparent;
  font-size: .16rem;
  width: 100%;
}
input::-webkit-input-placeholder {
  color: @font-color;
}
</style>
