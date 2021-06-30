<template>
  <div class="admin">
    <div>
      <h1>这里的功能可别试哟，非GM调接口直接封号的哦</h1>
      <a-card title="PY" size="small" class="send">
        <a-form :labelCol="{ span: 6 }">
          <a-form-item label="玩家账号">
            <a-select mode="multiple" v-model:value="player">
              <a-select-option v-for="p in playerList" :key="p" :value="p">
                {{ p }}
              </a-select-option>
            </a-select>
            <a @click="handleGetInlinePlayer">刷新</a>
          </a-form-item>
          <a-form-item label="经验值">
            <a-input v-model:value="exp" />
          </a-form-item>
          <a-form-item label="道具">
            <a-select mode="multiple" v-model:value="goodsList">
              <a-select-option v-for="g in GoodsData" :key="g._id" :value="g._id">
                {{ g.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="金币">
            <a-input v-model:value="gold" />
          </a-form-item>
          <div style="text-align:center">
            <a-button type="primary" @click="handleSendSometing">发送</a-button>
          </div>
        </a-form>
      </a-card>
      <div style="text-align:center;margin-top: 16px;">
        <a-button type="danger" @click="handleResetPlayerSkills">重置所有玩家技能数值</a-button>
        <a-button type="danger" @click="handleReloadConfig" style="margin-left: 16px;">重载配置</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsData from '@/data/goods.json'
import { sendSometing, resetPlayerSkills, reloadConfig, getInlinePlayer } from '@/api/admin'
import { message } from 'ant-design-vue'
export default {
  data() {
    return {
      GoodsData,
      player: [],
      playerList: [],
      exp: null,
      goodsList: [],
      gold: null
    }
  },
  methods: {
    async handleGetInlinePlayer() {
      const { data } = await getInlinePlayer()
      this.playerList = data
      message.success('刷新成功')
    },
    async handleSendSometing() {
      await sendSometing({ player: this.player, exp: this.exp, goods: this.goodsList, gold: this.gold })
      message.success('发送成功')
    },
    async handleResetPlayerSkills() {
      await resetPlayerSkills()
      message.success('重置成功')
    },
    async handleReloadConfig() {
      await reloadConfig()
      message.success('重载成功')
    }
  }
}
</script>

<style lang="less" scoped>
.admin {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .send {
    width: 500px;
  }
}

</style>
