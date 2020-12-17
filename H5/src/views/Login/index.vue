<template>
  <div class="login-box">
    <a-spin tip="飞升中......" :spinning="loading">
      <a-form layout="vertical" :model="loginData" class="login">
        <a-form-item label='帐号'>
          <a-input v-model:value="loginData.username">
            <template #prefix><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
          </a-input>
        </a-form-item>
        <a-form-item label='密码'>
          <a-input v-model:value="loginData.password" type="password">
            <template #prefix><LockOutlined style="color:rgba(0,0,0,.25)"/></template>
          </a-input>
        </a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            @click="handleLogin"
            style="width:100%;margin-bottom:30px;"
          >
            开启仙界
          </a-button>
      </a-form>
    </a-spin>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { setToken, getToken } from '@/util/auth'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import game from '@/util/game.js'
export default defineComponent({
  components: { UserOutlined, LockOutlined },
  data() {
    return {
      loading: false,
      loginData: {
        username: getToken(),
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      try {
        const { loginData } = this
        if (!loginData.username) {
          throw new Error('飞升的凡人得有个账号')
        }
        if (!loginData.password) {
          throw new Error('飞升的凡人还得有个密码')
        }
        await game.login(loginData)
        message.success('飞升成功！')
        setToken(loginData.username)
        this.$router.push({
          name: 'Main'
        })
      } catch (e) {
        console.log(e)
        message.error(e.msg || '飞升失败，有可能是阁下的账号密码问题，也有可能是天界没开……')
      }
      this.loading = false
    }
  }
})
</script>

<style lang="less" scoped>
.login-box{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  background-image: linear-gradient(155deg, #029CFE, #01D8EA);
  .login{
    width: 400px;
    max-width: 100%;
    padding: 0 35px 0;
    margin: 0 auto;
  }
}

</style>
