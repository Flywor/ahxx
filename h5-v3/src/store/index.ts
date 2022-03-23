import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import StoreModel from '@/types/Store'
import PlayerModel from '@/types/Player'
import request from '@/util/request'

// 定义 injection key 为了做类型推断
export const key: InjectionKey<Store<StoreModel>> = Symbol('store')

let tempI = true
export const store = createStore<StoreModel>({
  state: {
    player: new PlayerModel(),
    pos: { name: '', x: 0, y: 0, sizeX: 0, sizeY: 0 },
    units: [],
    monsterMap: [],
    skillList: [],
    confirm: { tid: '', title: '', content: '' },
    equipList: [],
    goodsList: [],
    news: [],
    fb: {}
  },
  mutations: {
    setPlayer(state, data) {
      state.player = { ...state.player, ...data }
      if (data.hp_c) {
        const my = state.units.find(u => u.name == state.player.username)
        if (my) {
          my.hp_c = data.hp_c
          my.per = my.hp_c / my.hp * 100
          if (my.per > 100) {
            my.per = 100
          }
          if (my.per > 70) {
            my.percolor = '#0dea0d'
          } else if (my.per > 30) {
            my.percolor = '#ffcb6d'
          } else {
            my.percolor = 'red'
          }
        }
      }
    },
    setFB(state, fb) {
      state.fb = { ...state.fb, ...fb }
    },
    setPos(state, data) {
      state.pos = { ...state.pos, ...data }
    },
    setUnits(state, data) {
      tempI = !tempI
      data.map((unit: any) => {
        const old = state.units.find(u => u.id == unit.id)
        if (old) {
          unit.differ_hp_c = unit.hp_c - old.hp_c
        }
        unit.distance = Math.floor(Math.sqrt(Math.pow(unit.x - state.pos.x, 2) + Math.pow(unit.y - state.pos.y, 2)))
        unit.per = unit.hp_c / unit.hp * 100
        if (unit.per > 70) {
          unit.percolor = '#0dea0d'
        } else if (unit.per > 30) {
          unit.percolor = '#ffcb6d'
        } else {
          unit.percolor = 'red'
        }

        if (['m1', 'm2', 'm3', 'm4'].includes(unit.type)) {
          let mp = state.monsterMap.find(mp => mp.map == state.pos.name)
          if (!mp) {
            state.monsterMap.push({ map: state.pos.name, monster: [] })
            mp = state.monsterMap.find(mp => mp.map == state.pos.name)
          }
          if (!mp?.monster.includes(unit.name)) {
            mp?.monster.push(unit.name)
          }
        }

        unit.classChange = tempI?1:0

        if (unit.name == state.player.username && unit.type == 'player') {
          state.player.hp_c = unit.hp_c
        }
      })
      data = data.sort((a: any, b: any) => a.distance - b.distance)
      state.units = data
    },
    setSkillList(state, data) {
      state.skillList = data
    },
    setConfirm(state, data) {
      state.confirm = data
    },
    setEquipList(state, data) {
      state.equipList = data
    },
    setGoodsList(state, data) {
      state.goodsList = data
    },
    recordNews(state, news) {
      state.news.push(news)
    }
  },
  actions: {
    init() {
      request({
        url: '/init',
        method: 'get'
      })
    }
  }
})