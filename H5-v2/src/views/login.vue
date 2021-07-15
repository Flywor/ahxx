<template>
  <div class="login">
    <div>
      <p class="title">
        暗黑修仙
      </p>
      <p>
        <Input v-model:value="loginForm.username" placeholder="账号" />
      </p>
      <p>
        <Input v-model:value="loginForm.password" placeholder="密码" type="password" />
      </p>
      <p>
        <Button @click="handleLogin">确定</Button>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import Game from '@/util/game'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
export default {
  name: 'login',
  components: { Input, Button },
  data() {
    return {
      loginForm: {
        username: localStorage.getItem('username') || '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      this.$loading.show()
      try {
        const { loginForm } = this
        if (!loginForm.username) {
          throw new Error('有个账号才能飞升呀。。')
        }
        if (!loginForm.password) {
          throw new Error('有个密码才能飞升呀。。')
        }
        await Game.login(loginForm)
        localStorage.setItem('username', loginForm.username)
        this.$router.push({
          name: 'home'
        })
      } catch (e) {
        this.$msg.show(e.message || '飞升失败，有可能是阁下的账号密码问题，也有可能是仙界没开……')
      }
      this.$loading.hide()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  &::before {
    content: '';
    background: url(/static/image/bg.jpg) center center;
    background-size: auto 100%;
    filter: blur(5px);
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  & > div {
    width: 70%;
    z-index: 1;
  }
  .title {
    font-size: .4rem;
    text-align: center;
    margin-bottom: .7rem;
  }
  p {
    margin: .3rem 0;
  }
  span {
    color: #f33e3e;
  }
}
</style>
