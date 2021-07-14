<template>
  <div class="login">
    <div>
      <p class="title">
        暗黑修仙
      </p>
      <p>
        <Input v-model:value="a" placeholder="账号" />
      </p>
      <p>
        <Input v-model:value="a" placeholder="密码" />
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import Input from '@/components/Input.vue'
export default {
  name: 'login',
  components: { Input },
  data() {
    return {
      a: ''
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(/static/image/bg3.jpg) center center;
  background-size: auto 100%;
  .title {
    font-size: .4rem;
    text-align: center;
    margin-bottom: .7rem;
  }
  p {
    margin: .3rem 0;
  }
}
</style>
