<template>
  <div class="home flex">
    <a-card class="carddd" :title="player.username" style="flex: unset;min-width:unset;width: 260px;min-width: 260px">
      <a-tabs type="card">
        <a-tab-pane key="1" tab="属性">
          <AttrComp />
        </a-tab-pane>
        <a-tab-pane key="3" tab="技能">
          <SkillsComp />
        </a-tab-pane>
        <a-tab-pane key="2" tab="法宝">
          <FBComp />
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card class="carddd">
      <a-tabs type="card">
        <a-tab-pane key="0" tab="装备">
          <EquipComp />
        </a-tab-pane>
        <a-tab-pane key="2" tab="道具">
          <GoodsComp />
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card class="carddd" :title="`${pos.name}：${pos.y},${pos.x}`" style="flex: unset;width: 667px;min-width: 667px;">
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
        v-if="player.username == 'admin'"
      >
        重载配置
      </a-button>
      <a-button
        @click="handleSaveAll"
        v-if="player.username == 'admin'"
      >
        全局保存
      </a-button>
      <div v-if="player.username == 'admin'" style="width:300px;display:flex;margin-top:16px;">
        <a-input v-model:value="state.vname" placeholder="账号"/>
        <a-input-number v-model:value="state.vlv" placeholder="vip等级"/>
        <a-button
          @click="handleSetVip"
        >
          设置vip
        </a-button>
      </div>
      <div v-if="player.username == 'admin'" style="width:300px;display:flex;margin-top:16px;">
        <a-input v-model:value="state.vname" placeholder="账号"/>
        <a-button
          @click="handleKick"
        >
          踢下线
        </a-button>
      </div>
      <div v-if="player.username == 'admin'" style="display:flex;margin-top:16px;">
        <a-input v-model:value="state.vname" placeholder="账号"/>
        <a-input v-model:value="state.sendgoodsId" placeholder="道具id"/>
        <a-input-number v-model:value="state.sendnum" placeholder="数量" style="width:100px;"/>
        <a-button @click="handleSendGoods">
          发送
        </a-button>
      </div>
      <a-divider>工具</a-divider>
      <div>
        前往坐标：
        <a-input-number v-model:value="state.toY" :min="0" :max="pos.sizeY" style="width:80px"/>
        <a-input-number v-model:value="state.toX" :min="0" :max="pos.sizeX" style="width:80px"/>
        <a-button v-if="state.isGoing" @click="state.isGoing = false" type="primary" danger>停下！</a-button>
        <a-button v-else @click="state.isGoing = true;handleGo()" type="primary">皮皮虾出发！</a-button>
      </div>
    </a-card>
    <a-card class="carddd" title="视野内单位">
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
    <div class="carddd">
      <a-card title="补给设定">
        <SupplyComp />
      </a-card>
      <a-card title="挂机设定">
        <HangUpComp :skill="state.skill" />
      </a-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, reactive } from 'vue'
import { store } from '@/store'
import request from '@/util/request'
import AttrComp from './attr.vue'
import EquipComp from './equip.vue'
import FBComp from './fb.vue'
import GoodsComp from './goods.vue'
import SkillsComp from './skills.vue'
import MapComp from './map.vue'
import HangUpComp from './hangup.vue'
import SupplyComp from './supply.vue'
import UnitIconComp from '@/components/unit-icon.vue'

store.dispatch('init')

const state = reactive({
  skill: localStorage.getItem('skill') || '',
  vname: '',
  vlv: 0,
  sendgoodsId: '',
  sendnum: '',
  toX: 0,
  toY: 0,
  isGoing: false
})
watch(() => state.skill, () => {
  localStorage.setItem('skill', state.skill)
})

const player = computed(() => store.state.player)
const pos = computed(() => store.state.pos)
const units = computed(() => store.state.units)
const skillList = computed(() => {
  const skillList = store.state.skillList
  if (!state.skill) {
    state.skill = skillList[0]?.id
  }
  return skillList
})

const handleUnitClick = (unit: any) => {
  if (unit.id && unit.distance <= player.value.attackDistance) {
    if (unit.name == player.value.username) {
      return
    }
    request({
      url: '/hey',
      method: 'post',
      data: { id: unit.id, x: unit.x, y: unit.y, sklid: state.skill }
    })
  } else {
    request({
      url: '/go',
      method: 'post',
      data: { x: unit.x, y: unit.y }
    })
  }
}

const handleReloadConfig = () => {
  request({
    url: '/reload',
    method: 'get'
  }).then(() => store.dispatch('init'))
}
const handleSaveAll = () => {
  request({
    url: '/allSave',
    method: 'get'
  })
}
const handleSetVip = () => {
  if(!state.vname || !state.vlv) {
    return
  }
  request({
    url: '/setVip',
    method: 'post',
    data: { vname: state.vname, vlv: state.vlv }
  })
}
const handleKick = () => {
  if(!state.vname) {
    return
  }
  request({
    url: '/kick',
    method: 'post',
    data: { name: state.vname }
  })
}
const handleSendGoods = () => {
  if(!state.vname || !state.sendgoodsId || !state.sendnum) {
    return
  }
  request({
    url: '/setGoods',
    method: 'post',
    data: { vname: state.vname, goodsId: state.sendgoodsId, num: state.sendnum }
  })
}
const handleGo = async () => {
  if (!state.isGoing) return
  state.isGoing = true
  const { toX, toY } = state
  const { x, y } = pos.value
  if (toX == x && toY == y) {
    state.isGoing = false
  } else {
    await request({
      url: '/go',
      method: 'post',
      data: { x: toX, y: toY }
    })
    setTimeout(() => {
      handleGo()
    }, 610)
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
  .carddd {
    height: 100%;
    flex: 1;
    min-width: 293px;
    overflow: auto;
  }
}
</style>
