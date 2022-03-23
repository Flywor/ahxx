<template>
  <p>Lv. {{player.lv}}</p>
  <p>金币：{{player.gold}}</p>
  <p>灵石：{{player.coin}}</p>
  <p :title="`${player.exp}/${player.lvUpExp}`">
    经验：{{(player.exp/player.lvUpExp*100).toFixed(4)}}%
  </p>
  <p>
    效率：{{state.expPerS * 60}}/分钟
  </p>
  <a-divider>基础属性</a-divider>

  <p>HP：{{player.hp_c}}/{{player.hp}}</p>
  <p>HP储备：{{player.hpRecovery}}【{{player.hpSec}}/s】</p>
  <p>MP：{{player.mp_c}}/{{player.mp}}</p>
  <p>MP储备：{{player.mpRecovery}}【{{player.mpSec}}/s】</p>
  <p>移动距离：{{player.speed}}格</p>
  <!-- <p>移动速度：{{Math.round(player.moveSpeed * 100)}}%</p> -->
  <p>攻击距离：{{player.attackDistance}}格</p>
  <p>攻击速度：{{Math.round(player.attackSpeed * 100)}}%</p>
  <p>视野范围：{{player.vision}}</p>
  <a-divider>物理属性</a-divider>
  <p>物理攻击：{{player.minAtk}}-{{player.maxAtk}}</p>
  <p>物理防御：{{player.def}}</p>
  <p>物理暴击几率：{{Math.round(player.strCritsRate*100)}}%</p>
  <p>物理暴击倍率：{{Math.round(player.strCritsDamageRate*100)}}%</p>
  <p>物防穿透：{{player.neglectDef}}点</p>
  <a-divider>法术属性</a-divider>
  <p>法术攻击：{{player.minMagic}}-{{player.maxMagic}}</p>
  <p>法术防御：{{player.magicDef}}</p>
  <p>法术暴击几率：{{Math.round(player.intCritsRate*100)}}%</p>
  <p>法术暴击倍率：{{Math.round(player.intCritsDamageRate*100)}}%</p>
  <p>法防穿透：{{player.neglectMagicDef}}点</p>
</template>
<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { store } from '@/store'
import { QuestionCircleTwoTone } from '@ant-design/icons-vue'
const player = computed(() => {
  const p = store.state.player
  if (state.oldExp) {
    if (state.oldExp > p.exp) {
      state.expRecord = []
    } else {
      state.expRecord.unshift(p.exp - state.oldExp)
    }
  }
  state.oldExp = p.exp
  return store.state.player
})
const state = reactive({
  oldExp: 0,
  expRecord: [],
  expPerSRecord: [],
  expPerS: 0,
  toLvUp: ''
})
setInterval(() => {
  let expPerS = 0
  state.expRecord.map(e => expPerS += e)
  state.expRecord = []
  state.expPerSRecord.unshift(expPerS)
  state.expPerSRecord.splice(60)
  let count = 0
  state.expPerSRecord.map(e => count += e)
  state.expPerS = Math.round(count / state.expPerSRecord.length)
}, 1000)
</script>
