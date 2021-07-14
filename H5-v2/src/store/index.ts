import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import StoreModel from '@/types/Store'
import PlayerModel from '@/types/Player'

// 定义 injection key 为了做类型推断
export const key: InjectionKey<Store<StoreModel>> = Symbol('store')

export const store = createStore<StoreModel>({
  state: {
    player: new PlayerModel()
  }
})