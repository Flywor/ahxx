<template>
  <div class="equip">
    <a-list item-layout="horizontal" :data-source="equipList.filter(u => u.status == 1)">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a :style="{ color: qualityColorMap[item.quality] }">Lv.{{item.lv}} {{ item.name }}</a>
            </template>
            <template #description>
              <p v-if="item.speed">移动速度：{{item.speed}}</p>
              <p v-if="item.attackDistance">攻击距离：{{item.attackDistance}}</p>
              <p v-if="item.vision">视野范围：{{item.vision}}</p>
              <p v-if="item.hp">HP：{{item.hp}}</p>
              <p v-if="item.mp">MP：{{item.hp}}</p>
              <p v-if="item.def">物理防御：{{item.def}}</p>
              <p v-if="item.magicDef">法术防御：{{item.magicDef}}</p>
              <p v-if="item.minAtk || item.maxAtk">物理攻击力：{{item.minAtk}}-{{item.maxAtk}}</p>
              <p v-if="item.strCritsRate">物理暴击几率：{{Math.round(item.strCritsRate*100)}}%</p>
              <p v-if="item.strCritsDamageRate">物理暴击倍率：{{Math.round(item.strCritsDamageRate*100)}}%</p>
              <p v-if="item.neglectDef">物防穿透：{{Math.round(item.neglectDef*100)}}%</p>
              <p v-if="item.minMagic || item.maxMagic">法术攻击力：{{item.minMagic}}-{{item.maxMagic}}</p>
              <p v-if="item.intCritsRate">法术暴击几率：{{Math.round(item.intCritsRate*100)}}%</p>
              <p v-if="item.intCritsDamageRate">法术暴击倍率：{{Math.round(item.intCritsDamageRate*100)}}%</p>
              <p v-if="item.neglectMagicDef">法防穿透：{{Math.round(item.neglectMagicDef*100)}}%</p>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a @click="() => handleEquip(item)">卸下</a>
          </template>
        </a-list-item>
      </template>
    </a-list>
    <a-divider>装备背包</a-divider>
    <a-list item-layout="horizontal" :data-source="equipList.filter(u => u.status == 0)">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a :style="{ color: qualityColorMap[item.quality] }">Lv.{{item.lv}} {{ item.name }}</a>
            </template>
            <template #description>
              <p v-if="item.speed">移动速度：{{item.speed}}</p>
              <p v-if="item.attackDistance">攻击距离：{{item.attackDistance}}</p>
              <p v-if="item.vision">视野范围：{{item.vision}}</p>
              <p v-if="item.hp">HP：{{item.hp}}</p>
              <p v-if="item.mp">MP：{{item.hp}}</p>
              <p v-if="item.def">物理防御：{{item.def}}</p>
              <p v-if="item.magicDef">法术防御：{{item.magicDef}}</p>
              <p v-if="item.minAtk || item.maxAtk">物理攻击力：{{item.minAtk}}-{{item.maxAtk}}</p>
              <p v-if="item.strCritsRate">物理暴击几率：{{Math.round(item.strCritsRate*100)}}%</p>
              <p v-if="item.strCritsDamageRate">物理暴击倍率：{{Math.round(item.strCritsDamageRate*100)}}%</p>
              <p v-if="item.neglectDef">物防穿透：{{Math.round(item.neglectDef*100)}}%</p>
              <p v-if="item.minMagic || item.maxMagic">法术攻击力：{{item.minMagic}}-{{item.maxMagic}}</p>
              <p v-if="item.intCritsRate">法术暴击几率：{{Math.round(item.intCritsRate*100)}}%</p>
              <p v-if="item.intCritsDamageRate">法术暴击倍率：{{Math.round(item.intCritsDamageRate*100)}}%</p>
              <p v-if="item.neglectMagicDef">法防穿透：{{Math.round(item.neglectMagicDef*100)}}%</p>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a @click="() => handleEquip(item)">穿戴</a>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import request from '@/util/request'
import { store } from '@/store'
const equipList = computed(() => store.state.equipList)
const handleEquip = (item: any) => {
  request({
    url: '/equip',
    method: 'post',
    data: { id: item._id }
  })
}
const qualityColorMap = {
  1: 'rgba(0, 0, 0, 0.65)',
  2: '#0779e4',
  3: '#9d0191',
  4: '#ff7e67'
}
</script>
<style lang="less" scoped>
.equip {
  p {
    margin-bottom: 0;
  }
}
</style>