<template>
  <div class="login">
    <div>
      <p class="title">
        暗黑修仙
      </p>
      <p>
        <a-input v-model:value="loginForm.username" placeholder="账号" />
      </p>
      <p>
        <a-input v-model:value="loginForm.password" placeholder="密码" type="password" />
      </p>
      <span v-show="error">
        {{error}}
      </span>
      <p>
        <a-button style="width:100%;" type="primary" @click="handleLogin">
          直接登录用不着注册按钮比较长好点一些
        </a-button>
      </p>
      <p>
        官方Q群：871302385  点击不会复制得手动
      </p>
      <p>广告位招租</p>
      <p>用了金坷垃，大家都爱他！</p>
    </div>
  </div>
</template>
<script lang="ts">
import request from '@/util/request'
export default {
  name: 'login',
  data() {
    return {
      error: '',
      loginForm: {
        username: localStorage.getItem('username'),
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      this.$loading.show()
      this.error = ''
      const { loginForm } = this
      if (!loginForm.username) {
        throw new Error('有个账号才能飞升呀。。')
      }
      if (!loginForm.password) {
        throw new Error('有个密码才能飞升呀。。')
      }
      const { status, statusText, data } = await request({
        url: '/login',
        method: 'post',
        data: loginForm
      })
      if (status === 200) {
        window.token = data
        localStorage.setItem('username', loginForm.username)
        localStorage.setItem('token', data)
        this.$router.push({
          name: 'home'
        })
      } else {
        this.error = statusText
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
