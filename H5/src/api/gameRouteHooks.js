import store from '../store/index'
import { message } from 'ant-design-vue'
import GoodsData from '@/data/Goods.json'
// ws路由推送处理
export default {
  // 用户完整信息 -- 推送当前用户 -- 登录触发
  'player.userinfo'(data) {
    console.log('player.userinfo:', data)
    store.commit('setUser', data.player)
    store.commit('setEquip', data.equip)
  },
  // 用户的技能信息，有战宠的话也一并返回 -- 推送当前用户 -- 登录触发
  'player.skills'(data) {
    console.log('player.skills:', data)
    store.commit('setUserSkills', data.skills)
    store.commit('setBattlePet', data.battlePet)
  },
  // 用户所处地图 -- 地图发生变化时触发
  'player.map'(mapid) {
    console.log('player.map:', mapid)
    store.commit('setBattleMap', mapid)
  },
  // 队伍信息 -- 推送队伍内所有玩家 -- 队伍发生变化触发
  'team.myTeamInfo'(data) {
    console.log('team.myTeamInfo:', data)
    store.commit('setTeamInfo', data.team)
  },
  // 怪物战斗初始化信息 -- 推送队伍内所有玩家 -- 发生与怪物战斗时触发
  'battle.monsterRoundBattle'(data) {
    console.log('battle.monsterRoundBattle:', data)
    const { battle, actions } = data
    store.commit('setBattle', battle)
    store.commit('setActions', actions)
  },
  // 怪物战斗结束结算-- 推送队伍内所有玩家 -- 打完怪触发
  'battle.monsterBattleEnd'(data) {
    console.log('battle.monsterBattleEnd:', data)
    store.commit('setBattle', null)
    store.commit('setActions', null)
    if (!data.fail) {
      const goods = []
      if (data.goods) {
        data.goods.map(gdsId => {
          const gds = GoodsData.find(gd => gd._id === gdsId) || {}
          goods.push(gds.name || '未知物品')
        })
      }
      message.info(`获得经验${data.exp}${goods.length ? `，获得物品${goods.join('，')}` : ''}${data.equip ? `，获得装备${data.equip.name}` : ''}`)
    }
  }
}
