<template>
  <div class="home flex">
    <a-card :title="player.username" style="width: 500px">
      <a-tabs type="card">
        <a-tab-pane key="1" tab="人物属性">
          <AttrComp />
        </a-tab-pane>
        <a-tab-pane key="0" tab="装备">
          <EquipComp />
        </a-tab-pane>
        <a-tab-pane key="2" tab="道具">
          <GoodsComp />
        </a-tab-pane>
        <a-tab-pane key="3" tab="技能">
          <SkillsComp />
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card :title="`${pos.name}：${pos.y},${pos.x}`">
      <MapComp :skill="state.skill"/>
      <a-divider>可用技能</a-divider>
      <a-tooltip v-for="skl in skillList" :key="skl.id">
        <template #title>{{skl.mark}}</template>
        <a-button
          style="margin-right: 16px;"
          :type="skl.id == state.skill?'primary':'default'"
          @click="state.skill = skl.id"
        >
          {{skl.name}}
        </a-button>
      </a-tooltip>
      <a-button
        @click="handleReloadConfig"
      >
        重载配置
      </a-button>
    </a-card>
    <a-card title="视野内单位" style="width: 500px">
      <a-list item-layout="horizontal" :data-source="units.filter(u => u.name != player.username)">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :description="`${item.hp_c || item.hp}/${item.hp}`">
              <template #avatar>
                <UnitIconComp :type="item.type" style="font-size: 28px"/>
              </template>
              <template #title>
                <a>Lv.{{item.lv}} {{ item.name }}</a>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a @click="() => handleUnitClick(item)">{{['m1', 'm2', 'm3', 'm4'].includes(item.type)?'攻击':'交互'}}</a>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { store } from '@/store'
import request from '@/util/request'
import AttrComp from './attr.vue'
import EquipComp from './equip.vue'
import GoodsComp from './goods.vue'
import SkillsComp from './skills.vue'
import MapComp from './map.vue'
import UnitIconComp from '@/components/unit-icon.vue'

store.dispatch('init')

const state = reactive({
  skill: ''
})

const player = computed(() => store.state.player)
const pos = computed(() => store.state.pos)
const units = computed(() => store.state.units)
const skillList = computed(() => {
  const skillList = store.state.skillList
  state.skill = skillList[0]?.id
  return skillList
})

const handleUnitClick = (unit: any) => {
  request({
    url: '/hey',
    method: 'post',
    data: { id: unit.id, x: unit.x, y: unit.y, sklid: state.skill }
  })
}

const handleReloadConfig = () => {
  request({
    url: '/reload',
    method: 'get'
  }).then(() => location.reload())
}
</script>

<style lang="less">
</style>
