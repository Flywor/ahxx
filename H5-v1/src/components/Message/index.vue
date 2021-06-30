<template>
  <div class="msg">
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const msg = ref('')
    const channel = ref('世界')
    return {
      msg,
      channel
    }
  }
})
</script>

<style lang="less" scoped>
.msg{
  border: 1px solid #ccc;
  position: relative;
  .sendMsg{
    position: absolute;
    bottom: -1px;
    left: -1px;
    width: 100%;
    .channel{
      width: 30%;
    }
    .send{
      width: calc(100% - 30%);
    }
  }
}
</style>
