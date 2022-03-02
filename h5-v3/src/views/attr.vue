<template>
  <p>Lv. {{player.lv}}</p>
  <p>金币：{{player.gold}}</p>
  <p>灵石：{{player.coin}}</p>
  <p>经验：{{player.exp}}/{{player.lvUpExp}}</p>
  <a-divider>基础属性</a-divider>
  <p>HP：{{player.hp_c}}/{{player.hp}}</p>
  <p>MP：{{player.mp_c}}/{{player.mp}}</p>
  <p>移动速度：{{player.speed}}</p>
  <p>攻击距离：{{player.attackDistance}}</p>
  <p>视野范围：{{player.vision}}</p>
  <a-divider>物理属性</a-divider>
  <p>物理攻击：{{player.minAtk}}-{{player.maxAtk}}</p>
  <p>物理防御：{{player.def}}</p>
  <p>物理暴击几率：{{Math.round(player.strCritsRate*100)}}%</p>
  <p>物理暴击倍率：{{Math.round(player.strCritsDamageRate*100)}}%</p>
  <p>物防穿透：{{Math.round(player.neglectDef*100)}}%</p>
  <a-divider>法术属性</a-divider>
  <p>法术攻击：{{player.minMagic}}-{{player.maxMagic}}</p>
  <p>法术防御：{{player.magicDef}}</p>
  <p>法术暴击几率：{{Math.round(player.intCritsRate*100)}}%</p>
  <p>法术暴击倍率：{{Math.round(player.intCritsDamageRate*100)}}%</p>
  <p>法防穿透：{{Math.round(player.neglectMagicDef*100)}}%</p>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { store } from '@/store'
const player = computed(() => store.state.player)
</script>
