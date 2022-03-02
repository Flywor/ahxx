import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import StoreModel from '@/types/Store'
import PlayerModel from '@/types/Player'
import request from '@/util/request'

// 定义 injection key 为了做类型推断
export const key: InjectionKey<Store<StoreModel>> = Symbol('store')

export const store = createStore<StoreModel>({
  state: {
    player: new PlayerModel(),
    pos: { name: '', x: 0, y: 0 },
    units: [],
    skillList: [],
    confirm: { tid: '', title: '', content: '' },
    equipList: [],
    goodsList: []
  },
  mutations: {
    setPlayer(state, data) {
      state.player = { ...state.player, ...data }
      if (data.hp_c) {
        const my = state.units.find(u => u.name == state.player.username)
        if (my) {
          my.hp_c = data.hp_c
          my.per = my.hp_c / my.hp * 100
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
    setPos(state, data) {
      state.pos = { ...state.pos, ...data }
    },
    setUnits(state, data) {
      data.map((unit: any) => {
        unit.distance = Math.floor(Math.sqrt(Math.pow(unit.x - state.pos.x, 2) + Math.pow(unit.y - state.pos.y, 2)))
        unit.per = unit.hp_c / unit.hp * 100
        if (unit.per > 70) {
          unit.percolor = '#0dea0d'
        } else if (unit.per > 30) {
          unit.percolor = '#ffcb6d'
        } else {
          unit.percolor = 'red'
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