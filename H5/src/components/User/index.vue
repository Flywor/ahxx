<template>
  <div class="userInfo">
    <div class="info-box">
      <div class="detail">
        <h3>Lv.{{user.lv}} {{user.username}}</h3>
        <div>经验：{{user.exp_c}}/{{user.exp}}</div>
        <div>金币：{{user.gold}}</div>
        <div>血量：{{user.hp}}</div>
        <div>攻击：{{user.atk}}</div>
        <div>防御：{{user.def}}</div>
        <div>速度：{{user.speed}}</div>
        <div>经验倍率：{{user.expRate * 100}}%</div>
        <div>装备爆率：{{user.dropRate * 100}}%</div>
        <div>暴击几率：{{user.critsRate * 100}}%</div>
        <div>暴击伤害：{{user.critsDamageRate * 100}}%</div>
      </div>
      <a-card :title="`可分配属性点[${remainAttr}]`" style="width:100%;" size="small">
        <template #extra>
          <a v-if="remainAttr !== user.attrPoint" @click="handleSaveAssign">确定</a>
        </template>
        <AttrComponent
          desc="体力"
          :attr="user.con"
          v-model:value="conAttr"
          :canOpera="remainAttr > 0"
        />
        <AttrComponent
          desc="力量"
          :attr="user.str"
          v-model:value="strAttr"
          :canOpera="remainAttr > 0"
        />
        <AttrComponent
          desc="耐力"
          :attr="user.vit"
          v-model:value="vitAttr"
          :canOpera="remainAttr > 0"
        />
        <AttrComponent
          desc="敏捷"
          :attr="user.agi"
          v-model:value="agiAttr"
          :canOpera="remainAttr > 0"
        />
      </a-card>
      &nbsp;
      <a-spin tip="请等待......" :spinning="teamLoading">
        <a-card :title="`${team?'我的':'所有'}队伍`" size="small">
          <template #extra>
            <a @click="handleCreateTeam" v-if="!team">创建队伍</a>
            <a @click="handleGetTeamList" v-if="!team" style="margin-left: 8px;">刷新</a>
            <a @click="handleLeaveTeam" v-if="team">离开队伍</a>
          </template>
          <template v-if="team">
            <div class="team" v-for="t in team" :key="t.username">
              <a style="color: red;width: 20px">{{t.leader?'★': ''}}</a>
              Lv.{{t.lv}}
              {{t.username}}
            </div>
          </template>
          <template v-else-if="teamList.length > 0">
            <div class="team" v-for="t in teamList" :key="t.leader">
              <label>
                Lv.{{t.leaderLv}}
                {{t.leader}}
                ({{t.teammateNum}}/5)
                [{{t.map}}]
              </label>
              <a @click="() => handleJoinTeam(t.leader)">加入队伍</a>
            </div>
          </template>
          <template v-else>
            刷新获取队伍
          </template>
        </a-card>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AttrComponent from './attr'
import { assignAttr } from '@/api/player'
import { createTeam, leaveTeam, joinTeam, getTeamList } from '@/api/team'
export default defineComponent({
  components: { AttrComponent },
  data() {
    return {
      conAttr: 0,
      strAttr: 0,
      vitAttr: 0,
      agiAttr: 0,
      teamLoading: false,
      teamList: []
    }
  },
  computed: {
    user() {
      if (!this.$store.state.user) {
        return {}
      }
      return this.$store.state.user
    },
    remainAttr() {
      return this.user.attrPoint - (this.conAttr + this.strAttr + this.vitAttr + this.agiAttr)
    },
    team() {
      return this.$store.state.team
    }
  },
  methods: {
    async handleSaveAssign() {
      await assignAttr({ con: this.conAttr, str: this.strAttr, vit: this.vitAttr, agi: this.agiAttr })
      this.conAttr = 0
      this.strAttr = 0
      this.vitAttr = 0
      this.agiAttr = 0
    },
    async handleCreateTeam() {
      await createTeam()
    },
    async handleGetTeamList() {
      const list = await getTeamList()
      this.teamList = list
    },
    async handleLeaveTeam() {
      await leaveTeam()
    },
    async handleJoinTeam(leader) {
      await joinTeam(leader)
    }
  }
})
</script>

<style lang="less" scoped>
.userInfo{
  width: 100%;
  border: 1px solid #f1f1f1;
  padding-bottom: 16px;
  .info-box{
    padding: 0 16px;
    .detail{
      line-height: 28px;
      font-weight: 500;
      & > div {
        font-size: 14px;
      }
    }
  }
  .team {
    display: flex;
    label {
      flex: 1;
    }
  }
}
</style>
