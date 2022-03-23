<template>
  <div class="equip">
    <a-list item-layout="horizontal" :data-source="equipList.filter(u => u.status == 1)">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a :style="{ color: qualityColorMap[item.quality] }">
                Lv.{{item.lv}} {{ item.name }}
                <i style="font-size:12px;color:green;">{{EquipTypeMap[item.type]}}</i>
              </a>
            </template>
            <template #description>
              <p v-if="item.moveSpeed">移动速度：{{Math.round(item.moveSpeed * 100)}}%</p>
              <p v-if="item.attackSpeed">攻击速度：{{Math.round(item.attackSpeed * 100)}}%</p>
              <p v-if="item.speed">移动距离：{{item.speed}}</p>
              <p v-if="item.attackDistance">攻击距离：{{item.attackDistance}}</p>
              <p v-if="item.vision">视野范围：{{item.vision}}</p>
              <p v-if="item.hp">HP：{{item.hp}}</p>
              <p v-if="item.hpSec">每秒恢复HP：{{item.hpSec}}</p>
              <p v-if="item.mp">MP：{{item.mp}}</p>
              <p v-if="item.mpSec">每秒恢复MP：{{item.mpSec}}</p>
              <p v-if="item.def">物理防御：{{item.def}}</p>
              <p v-if="item.magicDef">法术防御：{{item.magicDef}}</p>
              <p v-if="item.minAtk || item.maxAtk">物理攻击力：{{item.minAtk}}-{{item.maxAtk}}</p>
              <p v-if="item.strCritsRate">物理暴击几率：{{Math.round(item.strCritsRate*100)}}%</p>
              <p v-if="item.strCritsDamageRate">物理暴击倍率：{{Math.round(item.strCritsDamageRate*100)}}%</p>
              <p v-if="item.neglectDef">物防穿透：{{item.neglectDef}}点</p>
              <p v-if="item.minMagic || item.maxMagic">法术攻击力：{{item.minMagic}}-{{item.maxMagic}}</p>
              <p v-if="item.intCritsRate">法术暴击几率：{{Math.round(item.intCritsRate*100)}}%</p>
              <p v-if="item.intCritsDamageRate">法术暴击倍率：{{Math.round(item.intCritsDamageRate*100)}}%</p>
              <p v-if="item.neglectMagicDef">法防穿透：{{item.neglectMagicDef}}点</p>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a @click="() => handleEquip(item)">卸下</a>
          </template>
        </a-list-item>
      </template>
    </a-list>
    <a-divider>
      <a-button danger type="primary" size="small" @click="handleSellUnlock">卖无锁</a-button>
      <a-button style="margin: 0 8px" type="primary" size="small" @click="handleGetEquip">刷新背包</a-button>
      <a-button danger type="primary" size="small" @click="handleSell12">卖蓝白</a-button>
    </a-divider>
    <a-list item-layout="vertical" :data-source="equipList.filter(u => u.status == 0)">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a :style="{ color: qualityColorMap[item.quality] }">
                Lv.{{item.lv}} {{ item.name }}
                <i style="font-size:12px;color:green;">{{EquipTypeMap[item.type]}}</i>
              </a>
            </template>
            <template #description>
              <p v-if="item.moveSpeed">移动速度：{{Math.round(item.moveSpeed * 100)}}%</p>
              <p v-if="item.attackSpeed">攻击速度：{{Math.round(item.attackSpeed * 100)}}%</p>
              <p v-if="item.speed">移动距离：{{item.speed}}</p>
              <p v-if="item.attackDistance">攻击距离：{{item.attackDistance}}</p>
              <p v-if="item.vision">视野范围：{{item.vision}}</p>
              <p v-if="item.hp">HP：{{item.hp}}</p>
              <p v-if="item.hpSec">每秒恢复HP：{{item.hpSec}}</p>
              <p v-if="item.mp">MP：{{item.mp}}</p>
              <p v-if="item.mpSec">每秒恢复MP：{{item.mpSec}}</p>
              <p v-if="item.def">物理防御：{{item.def}}</p>
              <p v-if="item.magicDef">法术防御：{{item.magicDef}}</p>
              <p v-if="item.minAtk || item.maxAtk">物理攻击力：{{item.minAtk}}-{{item.maxAtk}}</p>
              <p v-if="item.strCritsRate">物理暴击几率：{{Math.round(item.strCritsRate*100)}}%</p>
              <p v-if="item.strCritsDamageRate">物理暴击倍率：{{Math.round(item.strCritsDamageRate*100)}}%</p>
              <p v-if="item.neglectDef">物防穿透：{{item.neglectDef}}点</p>
              <p v-if="item.minMagic || item.maxMagic">法术攻击力：{{item.minMagic}}-{{item.maxMagic}}</p>
              <p v-if="item.intCritsRate">法术暴击几率：{{Math.round(item.intCritsRate*100)}}%</p>
              <p v-if="item.intCritsDamageRate">法术暴击倍率：{{Math.round(item.intCritsDamageRate*100)}}%</p>
              <p v-if="item.neglectMagicDef">法防穿透：{{item.neglectMagicDef}}点</p>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a v-if="!item.lock" @click="() => handleSell(item)" style="color:red;">卖出</a>
            <a @click="() => handleLock(item)">{{item.lock?'解锁':'锁定'}}</a>
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
import { Modal } from 'ant-design-vue'
const EquipTypeMap = {
  0: '头盔',
  1: '手套',
  2: '鞋子',
  3: '衣服',
  4: '腰带',
  5: '武器',
  6: '戒指',
  7: '项链',
  8: '魂精'
}
const equipList = computed(() => store.state.equipList)
const handleEquip = (item: any) => {
  request({
    url: '/equip',
    method: 'post',
    data: { id: item._id }
  })
}
const handleSell = (item: any) => {
  Modal.confirm({
    title: '防手残确认框',
    content: '本当にこれを売るの?',
    onOk() {
      request({
        url: '/sell',
        method: 'post',
        data: { equipId: item._id }
      })
    }
  })
}
const handleSellUnlock = (item: any) => {
  Modal.confirm({
    title: '防手残确认框',
    content: '本当にこれを売るの?',
    // content: '将卖出无锁的白、蓝装',
    onOk() {
      request({
        url: '/sellUnlock',
        method: 'post'
      })
    }
  })
}
const handleSell12 = (item: any) => {
  Modal.confirm({
    title: '防手残确认框',
    content: '将卖出无锁的白、蓝装',
    onOk() {
      request({
        url: '/sellUnlockQuality',
        method: 'post',
        data: { qualitys: [1, 2] }
      })
    }
  })
}
const handleLock = (item: any) => {
  request({
    url: '/lockEquip',
    method: 'post',
    data: { equipId: item._id }
  })
}
const handleGetEquip = (item: any) => {
  request({
    url: '/getEquip',
    method: 'get'
  })
}
const qualityColorMap = {
  1: 'rgba(0, 0, 0, 0.65)',
  2: '#0779e4',
  3: '#9d0191',
  4: 'red'
}
</script>
<style lang="less" scoped>
.equip {
  p {
    margin-bottom: 0;
    font-size: 12px;
  }
}
</style>