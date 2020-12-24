import { createStore } from 'vuex'
import { formatDate } from '@/util/tools'
export default createStore({
  state: {
    isLogin: false,
    user: {},
    equip: [],
    skills: [],
    isLeader: false,
    team: null,
    autoBattle: false,
    cachePlayerAction: null, // 全局缓存用户的自动战斗选择的技能
    battleMap: null,
    battlePet: {},
    battle: null,
    actions: [],
    combatGains: null,
    earnings: [],
    showHall: false
  },
  mutations: {
    setLogin(state, islogin) {
      state.isLogin = islogin
    },
    // 当前玩家信息
    setUser(state, user) {
      state.user = user
    },
    setEquip(state, equip) {
      state.equip = equip
    },
    // 当前玩家的技能
    setUserSkills(state, skills) {
      state.skills = skills
    },
    // 当前玩家的队伍
    setTeamInfo(state, team) {
      if (team) {
        if (team.find(t => t.leader).username === state.user.username) {
          state.isLeader = true
        } else {
          state.isLeader = false
        }
      } else {
        state.isLeader = false
      }
      state.team = team
    },
    // store保存自动战斗开关
    setAutoBattle(state, flag) {
      state.autoBattle = flag
    },
    setCachePlayerAction(state, cachePlayerAction) {
      state.cachePlayerAction = cachePlayerAction
    },
    // 当前玩家挂机的地图
    setBattleMap(state, battleMap) {
      state.battleMap = battleMap
    },
    // 当前玩家的战宠
    setBattlePet(state, battlePet) {
      state.battlePet = battlePet || {}
    },
    // 战斗回合   双方数据
    setBattle(state, battle) {
      state.battle = battle
    },
    // 回合动作数据
    setActions(state, acts) {
      const actions = []
      if (acts) {
        acts.map((act, index) => {
          const a = `Lv.${act.actorLv} ${act.actor}`
          const action = { title: `【${index + 1}】<a>${a}</a>`, content: [] }
          if (act.beforeRound) {
            action.content.push(act.beforeRound)
            action.content.push('，')
          }
          const use = act.skill
          if (use) {
            if (act.target.length > 0) {
              act.target.map(t => {
                if (action.content.length !== 0) {
                  action.content.push('，')
                }
                const b = `Lv.${t.lv} ${t.name}`
                const hurt = t.hurt
                const buff = t.buff.join('')
                const debuff = t.debuff.join('')
                action.content.push(`对 <a>${b}</a> 使用 <a>${use}</a> `)
                if (hurt > -1) {
                  action.content.push(`造成 <a style="color:purple">${hurt}</a> `)
                }
                if (buff) {
                  action.content.push(`<a style="color: green">${buff}</a>`)
                }
                if (debuff) {
                  action.content.push(`<a style="color: red">${debuff}</a>`)
                }
              })
            } else {
              action.content.push(`使用了<a>${use}</a>`)
            }
          }
          actions.push(action)
        })
      }
      state.actions = actions
    },
    // 回合收益数据
    setCombatGains(state, combatGains) {
      state.combatGains = combatGains
    },
    // 统计战斗收益
    collectEarnings(state, data) {
      state.earnings.unshift({
        time: formatDate(new Date(), 'hh:mm:ss'),
        data: data
      })
    },
    // 清空战斗信息
    clearEarnings(state) {
      state.earnings = []
    },
    showTeamHall(state, bool) {
      state.showHall = bool
    }
  },
  actions: {},
  modules: {}
})
