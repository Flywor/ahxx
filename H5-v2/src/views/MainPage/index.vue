<template>
  <div class="header">
    <div class="left">
      <h1>暗黑修仙</h1>
    </div>
    <div class="right">
      <span>目前为测试版本，包含了大量的彩蛋（bug），随时会清数据，请放心食用</span>
      <a><MessageOutlined /></a>
      <a title="https://github.com/Flywor" href="https://github.com/Flywor" target="_blank"><GithubOutlined /></a>
      <a title="Q群：871302385"><QqOutlined /></a>
      <a title="设置"><SettingOutlined /></a>
      <a title="登出"><LogoutOutlined /></a>
    </div>
  </div>
  <div class="main-page">
    <div class="main-page-left">
      <User />
    </div>
    <div class="main-page-center">
      <Usually v-if="$store.state.user.username"/>
      <Battle />
    </div>
    <div class="main-page-right">
      <Equip />
      &nbsp;
      <Team />
      <a-spin tip="请等待......" :spinning="teamLoading">
        <a-card title="我的队伍" size="small">
          <template #extra>
            <a @click="openTeam">组队大厅</a>
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
import User from '@components/User'
import Battle from '@components/Battle/battle'
import Usually from '@components/Usually/usually'
import Equip from '@components/Equip/equip'
import { leaveTeam } from '@/api/team'
import Team from '@/components/User/team'
import {
  GithubOutlined,
  QqOutlined,
  SettingOutlined,
  LogoutOutlined,
  MessageOutlined
} from '@ant-design/icons-vue'

export default {
  components: { User, Battle, Usually, Equip, GithubOutlined, QqOutlined, SettingOutlined, LogoutOutlined, MessageOutlined, Team },
  data() {
    return {
      teamLoading: false,
      teamList: []
    }
  },
  computed: {
    team() {
      return this.$store.state.team
    }
  },
  methods: {
    async handleLeaveTeam() {
      await leaveTeam()
    },
    openTeam() {
      this.$store.commit('showTeamHall', true)
    }
  }
}
</script>

<style lang="less" scoped>
.header{
  width: 100%;
  height: 64px;
  line-height: 64px;
  box-shadow: 0 2px 8px #f0f1f2;
  font-family: 'ZCOOLKuaiLe-Regular';
  display: flex;
  a {
    margin: 0 16px;
    font-size: 20px;
    color: #01D8EA;
  }
  .left {
    flex: 1;
    h1 {
      margin: 0 16px;
    }
  }
}
.main-page {
  height: calc(100% - 64px);
  width: 100%;
  display: flex;
  padding: 16px;
  &-left {
    min-width: 240px;
    max-width: 320px;
  }
  &-center {
    flex: 1;
  }
  &-right {
    min-width: 240px;
    max-width: 320px;
  }
}
</style>
