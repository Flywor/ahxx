<template>
  <div id="map" :style="{ width: `${state.mapWidth}px` }">
    <div class="tr" v-for="(xArr, i) in mapInfo" :key="i">
      <div
        v-for="(unit, ii) in xArr"
        :key="unit.id || `${i}-${ii}`"
        class="td"
        :style="{
          background: (unit.x < 0 || unit.y < 0 || unit.x > pos.sizeX || unit.y > pos.sizeY) ? '': 'rgb(243 243 243 / 52%)' 
        }"
        @click="() => handleUnitClick(unit)"
      >
      </div>
    </div>
    <transition-group>
      <div
        v-for="unit in units"
        :key="unit.id"
        :class="`unit ${getHurtEffect(unit)}`"
        :style="{
          left: `${(unit.y - startY) * (state.mapWidth / mapSize)}px`,
          top: `${(unit.x - startX) * (state.mapWidth / mapSize)}px`,
          transform: `scale(${unit.lv > 999 ? 2: 1})`
        }"
        @click="() => handleUnitClick(unit)"
      >
        <div v-if="unit.differ_hp_c < 0" :class="`hphurt hphurt${unit.classChange}`">
          {{unit.differ_hp_c}}
        </div>
        <!-- <div class="vip" v-if="unit.vip > 0">V{{unit.vip}}</div> -->
        <div class="hp" v-if="unit.hp_c">
          <div :style="{ width: `${unit.per}%`, background: unit.percolor }"/>
        </div>
        <div style="font-size:10px;margin-bottom: -10px;">
          <label v-if="unit.hp_c">LV.{{unit.lv}}</label>
          {{unit.name}}
        </div>
        <UnitIconComp :type="unit.type" />
      </div>
    </transition-group>
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

let tempI = true
const getHurtEffect = (unit: any) => {
  if (unit.differ_hp_c > 0) {
    return `recovery${unit.classChange}`
  }
  if (unit.differ_hp_c < 0) {
    return `hurt${unit.classChange}`
  }
}

let lastDo = 0
const handleUnitClick = (unit: any) => {
  if (Date.now() - lastDo < 610) {
    return
  }
  lastDo = Date.now()
  if (unit.id && unit.distance <= player.value.attackDistance) {
    if (unit.name == player.value.username) {
      return
    }
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
  .v-enter-to {
    opacity: 1;
  }
  .v-enter-active {
    transform: rotate(180deg);
  }
  .v-leave-to, .v-enter-active {
    opacity: 0;
  }
  .unit {
    position: absolute;
    font-size: 26px;
    transition: all .3s;
    text-align: center;
    .hp {
      height: 2px;
      position: relative;
      width: 70%;
      margin: 0 auto;
      background: #d6d6d6;
      & > div {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
      }
    }
    .vip {
      position: absolute;
      left: 100%;
      top: 0;
      font-size: 12px;
      border-radius: 100%;
      color: #ffa51e;
      font-family: monospace;
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
  .hphurt {
    position: absolute;
    top: -20px;
    left: 0;
    color: red;
    opacity: 0;
    font-size: 16px;
    width: 100%;
    text-align: center;
  }
  .hphurt0  {
    animation: hphurt0frame .2s 1;
  }
  .hphurt1  {
    animation: hphurt1frame .2s 1;
  }
  @keyframes hphurt0frame {
    0% { transform: translate(0, 0); top: -20px; opacity: 1; }
    40% { transform: translate(0, 4px); top: -30px; opacity: 0.4; }
    70% { transform: translate(0, 7px); top: -40px; opacity: 0.7; }
    100% { transform: translate(0, 10px); top: -50px; opacity: 0; }
  }
  @keyframes hphurt1frame {
    0% { transform: translate(0, 0); top: -20px; opacity: 1; }
    40% { transform: translate(0, 4px); top: -30px; opacity: 0.4; }
    70% { transform: translate(0, 7px); top: -40px; opacity: 0.7; }
    100% { transform: translate(0, 10px); top: -50px; opacity: 0; }
  }
}
</style>
