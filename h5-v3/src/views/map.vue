<template>
  <div id="map" :style="{ width: `${state.mapWidth}px` }">
    <div class="tr" v-for="(xArr, i) in mapInfo" :key="i">
      <div
        v-for="(unit, ii) in xArr"
        :key="unit.id || `${i}-${ii}`"
        class="td"
        :style="{
          background: (unit.x < 0 || unit.y < 0 || unit.x > pos.sizeX || unit.y > pos.sizeY) ? '': '#efefef' 
        }"
        @click="() => handleUnitClick(unit)"
      >
      </div>
    </div>
    <a-tooltip
      v-for="unit in units"
      :key="unit.id "
    >
      <template #title>Lv.{{unit.lv}} {{unit.name}}</template>
      <div
        :class="`unit ${getHurtEffect(unit)}`"
        :style="{
          left: `${(unit.y - startY) * (state.mapWidth / mapSize)}px`,
          top: `${(unit.x - startX) * (state.mapWidth / mapSize)}px`
        }"
        @click="() => handleUnitClick(unit)"
      >
        <div class="hp">
          <div :style="{ width: `${unit.per}%`, background: unit.percolor }"/>
        </div>
        <UnitIconComp :type="unit.type" />
      </div>
    </a-tooltip>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { store } from '@/store'
import request from '@/util/request'
import UnitIconComp from '@/components/unit-icon.vue'
const props = withDefaults(defineProps<{
  skill: string
}>(), {
  skill: ''
})

const state = reactive({
  mapWidth: 600
})

const player = computed(() => store.state.player)
const pos = computed(() => store.state.pos)
const units = computed(() => store.state.units)
const mapSize = computed(() => player.value.vision * 2 + 1)
const startX = computed(() => (pos.value.x - player.value.vision))
const startY = computed(() => (pos.value.y - player.value.vision))

const mapInfo = computed(() => {
  const result = []
  for (let x = startX.value; result.length < mapSize.value; x++) {
    const xArr = []
    for (let y = startY.value; xArr.length < mapSize.value; y++) {
      xArr.push({ x, y })
    }
    result.push(xArr)
  }
  return result
})

let temp = { id: 0, hp_c: 0 }
let tempI = true
const getHurtEffect = (unit: any) => {
  if (unit.id != temp.id) return ''
  let effct = ''
  if (unit.hp_c > temp.hp_c) {
    effct = 'recovery'
  }
  if (unit.hp_c < temp.hp_c) {
    effct = 'hurt'
  }
  if (effct) {
    temp = unit
  } 
  tempI = !tempI
  return `${effct}${tempI?0:1}`
}

const handleUnitClick = (unit: any) => {
  if (unit.id) {
    if (unit.name == player.value.username) {
      return
    }
    temp = unit
    request({
      url: '/hey',
      method: 'post',
      data: { id: unit.id, x: unit.x, y: unit.y, sklid: props.skill }
    })
  } else {
    request({
      url: '/go',
      method: 'post',
      data: { x: unit.x, y: unit.y }
    })
  }
}

</script>

<style lang="less">
#map {
  position: relative;
  .tr {
    display: flex;
    .td {
      flex: 1;
      text-align: center;
      overflow: hidden;
      &::before {
        content: '';
        padding-top: 100%;
        float: left;
      }
      &::after {
        content: '';
        display: block;
        clear: both;
      }
    }
  }
  .unit {
    position: absolute;
    font-size: 26px;
    transition: left .3s, top .3s;
    .hp {
      height: 2px;
      position: relative;
      width: 70%;
      margin: 0 auto;
      & > div {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        transition: width .3s;
      }
    }
  }
  .unit.hurt0  {
    span {
      animation: hurt0frame .1s 1;
    }
  }
  .unit.hurt1  {
    span {
      animation: hurt1frame .1s 1;
    }
  }
  @keyframes hurt0frame {
    0% { transform: translate(-5px, -5px); color: red; }
    40% { transform: translate(0, 0); }
    70% { transform: translate(0, 5px); color: red; }
    100% { transform: translate(5px, 5px); }
  }
  @keyframes hurt1frame {
    0% { transform: translate(5px, 5px); color: red; }
    40% { transform: translate(0, 0); }
    70% { transform: translate(0, -5px); color: red; }
    100% { transform: translate(-5px, -5px); }
  }
}
</style>
