<template>
  <div class="msg">
    {{txt}}
  </div>
</template>
<script lang="ts">
export default {
  name: 'Msg',
  props: {
    txt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

<style lang="less" scoped>
.msg {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 999999;
  transform: translate(-50%, -50%);
  border: 1px solid @font-color;
  background: #172a42;
  animation: msgframe 3.1s ease-in-out 1;
  border-radius: 3px;
  padding: .08rem .16rem;
  font-size: .16rem;
}
@keyframes msgframe {
  0% { margin-top: 50px; opacity: 0; }
  30% { margin-top: 0; opacity: 1; }
  70% { margin-top: 0; opacity: 1; }
  100% { margin-top: -50px; opacity: 0; }
}
</style>
