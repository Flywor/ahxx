import store from '../store/index'
import GoodsData from '@/data/Goods.json'
// ws路由推送处理
export default {
  // 用户完整信息 -- 推送当前用户 -- 登录触发
  'player.userinfo'(data) {
    store.commit('setUser', data.player)
    store.commit('setEquip', data.equip)
  },
  // 用户的技能信息，有战宠的话也一并返回 -- 推送当前用户 -- 登录触发
  'player.skills'(data) {
    store.commit('setUserSkills', data.skills)
    store.commit('setBattlePet', data.battlePet)
  },
  // 用户所处地图 -- 地图发生变化时触发
  'player.map'(mapid) {
    store.commit('setBattleMap', mapid)
  },
  // 队伍信息 -- 推送队伍内所有玩家 -- 队伍发生变化触发
  'team.myTeamInfo'(data) {
    store.commit('setTeamInfo', data.team)
  },
  // 怪物战斗初始化信息 -- 推送队伍内所有玩家 -- 发生与怪物战斗时触发
  'battle.monsterRoundBattle'(data) {
    const { battle, actions } = data
    store.commit('setBattle', battle)
    store.commit('setActions', actions)
  },
  // 怪物战斗结束结算-- 推送队伍内所有玩家 -- 打完怪触发
  'battle.monsterBattleEnd'(data) {
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
      // console.log(data)
      // store.commit('collectEarnings', `获得经验${data.exp}${data.goods.length ? `，获得物品${data.goods.join('，')}` : ''}${data.equip ? `，获得装备${data.equip.name}` : ''}`)
      store.commit('collectEarnings', data)
    }
  }
}
