<template>
  <div class="userInfo">
    <div class="info-box">
      <div class="detail">
        <h3>Lv.{{user.lv}} {{user.username}}</h3>
        <div>经验：{{user.exp_c}}/{{user.exp}}<a style="margin-left: 16px;" v-show="user.exp_c > user.exp" @click="handleLevelUp">升级</a></div>
        <div>金币：{{user.gold}}</div>
        <div>血量：{{user.hp}}</div>
        <div>攻击：{{user.atk}}</div>
        <div>防御：{{user.def}}</div>
        <div>速度：{{user.speed}}</div>
        <div>经验倍率：{{Math.round(user.expRate * 100)}}%</div>
        <div>装备爆率：{{Math.round(user.dropRate * 100)}}%</div>
        <div>暴击几率：{{Math.round(user.critsRate * 100)}}%</div>
        <div>暴击伤害：{{Math.round(user.critsDamageRate * 100)}}%</div>
      </div>
      <a-card :title="`可分配属性点[${remainAttr}]`" style="width:100%;" size="small">
        <template #extra>
          <a v-if="remainAttr !== user.attrPoint" @click="handleSaveAssign">确定</a>
          <a v-if="user.attrPoint === 0" @click="handleResetAssign">洗点</a>
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
      <Team />
      <a-spin tip="请等待......" :spinning="teamLoading">
        <a-card title="我的队伍" size="small">
          <template #extra>
            <a @click="openTeam">组队大厅</a>
            <a @click="handleGetTeamList" style="margin-left: 8px;">刷新</a>
            <a @click="handleLeaveTeam" v-if="team" style="margin-left: 8px;">离开队伍</a>
          </template>
          <template v-if="team">
            <div class="team" v-for="t in team" :key="t.username">
              <a style="color: red;width: 20px">{{t.leader?'★': ''}}</a>
              Lv.{{t.lv}}
              {{t.username}}
            </div>
          </template>
        </a-card>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AttrComponent from './attr'
import { assignAttr, resetAttr, levelUp } from '@/api/player'
import { leaveTeam } from '@/api/team'
import Team from '@/components/User/team'

export default defineComponent({
  components: {
    AttrComponent,
    Team
  },
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
    async handleResetAssign() {
      resetAttr()
    },
    async handleLeaveTeam() {
      await leaveTeam()
    },
    handleLevelUp() {
      levelUp()
    },
    openTeam() {
      this.$store.commit('showTeamHall', true)
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
}
</style>
