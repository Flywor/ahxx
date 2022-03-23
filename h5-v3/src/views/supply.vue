<template>
  <p>
    少于
    <a-input-number v-model:value="state.hp0" :controls="false" :min="0" style="width: 80px" />
    HP使用
    <a-select v-model:value="state.hpgoods0" :options="goodsList" style="width: 100px"/>
  </p>
  <p>
    少于
    <a-input-number v-model:value="state.hp1" :controls="false" :min="0" style="width: 80px" />
    HP使用
    <a-select v-model:value="state.hpgoods1" :options="goodsList" style="width: 100px"/>
  </p>
  <p>
    少于
    <a-input-number v-model:value="state.mp0" :controls="false" :min="0" style="width: 80px" />
    MP使用
    <a-select v-model:value="state.mpgoods0" :options="goodsList" style="width: 100px"/>
  </p>
  <p>
    少于
    <a-input-number v-model:value="state.mp1" :controls="false" :min="0" style="width: 80px" />
    MP使用
    <a-select v-model:value="state.mpgoods1" :options="goodsList" style="width: 100px"/>
  </p>
  <a @click="state.visible = true">死亡/掉落记录</a>
  <a-drawer
    v-model:visible="state.visible"
    title="死亡/掉落记录"
    placement="right"
  >
    <p v-for="n in news" :key="n">{{n}}</p>
  </a-drawer>
</template>
<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import request from '@/util/request'
import { store } from '@/store'
const supplyCache = JSON.parse(localStorage.getItem('supply') || '{}')
const state = reactive({
  hp0: supplyCache.hp0 || 0,
  hpgoods0: supplyCache.hpgoods0 || '',
  hp1: supplyCache.hp1 || 0,
  hpgoods1: supplyCache.hpgoods1 || '',
  mp0: supplyCache.mp0 || 0,
  mpgoods0: supplyCache.mpgoods0 || '',
  mp1: supplyCache.mp1 || 0,
  mpgoods1: supplyCache.mpgoods1 || '',
  visible: false
})
watch(state, () => {
  const p = store.state.player
  if (state.hp0 > p.hp) {
    state.hp0 = p.hp
  }
  if (state.hp1 > p.hp) {
    state.hp1 = p.hp
  }
  if (state.mp0 > p.mp) {
    state.mp0 = p.mp
  }
  if (state.mp1 > p.mp) {
    state.mp1 = p.mp
  }
  localStorage.setItem('supply', JSON.stringify(state))
})
watch(() => store.state.player, (p) => {
  if (state.hp0 > p.hp) {
    state.hp0 = p.hp
  }
  if (state.hp1 > p.hp) {
    state.hp1 = p.hp
  }
  if (state.mp0 > p.mp) {
    state.mp0 = p.mp
  }
  if (state.mp1 > p.mp) {
    state.mp1 = p.mp
  }
})
const goodsList = computed(() => {
  const list = [{ value: 0, label: '无' }]
  store.state.goodsList.filter(g => g.type == 0).map(g => list.push({ value: g.id, label: g.name }))
  return list
})
const news = computed(() => store.state.news)
setInterval(() => {
  const { hp_c, mp_c } = store.state.player
  if (hp_c < state.hp0 && state.hpgoods0 && goodsList.value.find(gl => gl.value == state.hpgoods0)) {
    request({
      url: '/goods',
      method: 'post',
      data: { id: state.hpgoods0 }
    })
  } else if (hp_c < state.hp1 && state.hpgoods1 && goodsList.value.find(gl => gl.value == state.hpgoods1)) {
    request({
      url: '/goods',
      method: 'post',
      data: { id: state.hpgoods1 }
    })
  } else if (mp_c < state.mp0 && state.mpgoods0 && goodsList.value.find(gl => gl.value == state.mpgoods0)) {
    request({
      url: '/goods',
      method: 'post',
      data: { id: state.mpgoods0 }
    })
  } else if (mp_c < state.mp1 && state.mpgoods1 && goodsList.value.find(gl => gl.value == state.mpgoods1)) {
    request({
      url: '/goods',
      method: 'post',
      data: { id: state.mpgoods1 }
    })
  }
}, 1000)
</script>