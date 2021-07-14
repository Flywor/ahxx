import PlayerModel from '@/types/Player'
import { store } from '@/store/index'
// ws路由推送处理
const hooks: { [proppName:string]: (data: any) => void } = {
  // 用户回合结算会更新的信息 -- 推送当前用户 -- 战斗结束触发
  'player.userbaseinfo'(data: { exp_c: number, gold: number }) {
    store.commit('setExpGold', data)
  },
  // 用户完整信息 -- 推送当前用户 -- 登录触发
  'player.userinfo'(data: { player: PlayerModel, equip: any }) {
    store.commit('setUser', data.player)
    store.commit('setEquip', data.equip)
  },
  // 用户的技能信息，有战宠的话也一并返回 -- 推送当前用户 -- 登录触发
  'player.skills'(data: { skills: any, battlePet: any }) {
    store.commit('setUserSkills', data.skills)
    store.commit('setBattlePet', data.battlePet)
  },
  // 用户所处地图 -- 地图发生变化时触发
  'player.map'(data: { mapid: string }) {
    store.commit('setBattleMap', data.mapid)
  },
  // 队伍信息 -- 推送队伍内所有玩家 -- 队伍发生变化触发
  'team.myTeamInfo'(data: { team: any }) {
    store.commit('setTeamInfo', data.team)
  },
  // 怪物战斗初始化信息 -- 推送队伍内所有玩家 -- 发生与怪物战斗时触发
  'battle.monsterRoundBattle'(data: { battle: any, actions: any }) {
    const { battle, actions } = data
    store.commit('setBattle', battle)
    store.commit('setActions', actions)
  },
  // 怪物战斗结束结算-- 推送队伍内所有玩家 -- 打完怪触发
  'battle.monsterBattleEnd'(data: { fail: boolean }) {
    store.commit('setBattle', null)
    store.commit('setActions', null)
    if (!data.fail) {
    }
  },
  // 系统通知
  'system.pushMessage'() {
  }
}

export default hooks