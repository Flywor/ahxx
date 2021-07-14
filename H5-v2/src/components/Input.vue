<template>
  <input
    class="input"
    v-bind="$attr"
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
  border: 1px solid #C9D1D9;
  border-radius: 3px;
  background: transparent;
  font-size: .16rem;
}
input::-webkit-input-placeholder {
  color: #e2e4e5;
}
</style>
