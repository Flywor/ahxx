<template>
  <p>
    <a-radio-group v-model:value="state.pos" name="pos">
      <a-radio :value="1">随机打怪</a-radio>
      <a-radio :value="2">范围打怪</a-radio>
    </a-radio-group>
  </p>
  <p v-if="state.pos == 2">
    <div>
      x坐标范围：
      <a-input-number v-model:value="state.xStart" :controls="false" :min="0" style="width: 50px" />
      -
      <a-input-number v-model:value="state.xEnd" :controls="false" :min="0" style="width: 50px" />
    </div>
    <div>
      y坐标范围：
      <a-input-number v-model:value="state.yStart" :controls="false" :min="0" style="width: 50px" />
      -
      <a-input-number v-model:value="state.yEnd" :controls="false" :min="0" style="width: 50px" />
    </div>
  </p>
  <p>
    <a-checkbox v-model:checked="state.getResource">拾取资源</a-checkbox>
  </p>
  <p>
    <a-checkbox v-model:checked="state.dontHit">不打怪</a-checkbox>
  </p>
  <p>
    <a-checkbox v-model:checked="state.hideP">隐藏玩家</a-checkbox>
  </p>
  <p>
    <a-checkbox v-model:checked="state.kite">风筝模式</a-checkbox>
  </p>
  <p>
    少于
    <a-input-number v-model:value="state.keepMinHP" :controls="false" :min="0" :max="player.hp" style="width: 100px" />
    血停手
  </p>
  <p>
    目标
    <a-select
      style="width:210px"
      v-model:value="state.hit"
      mode="multiple"
      :options="hitOptions"
    ></a-select>
  </p>
  <a-button v-if="state.isHangup" type="primary" danger @click="handleStopHangup">停止挂机</a-button>
  <a-button v-else type="primary" @click="state.isHangup = true">开始挂机</a-button>
</template>
<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import request from '@/util/request'
import { randomNum } from '@/util/tools'
import { store } from '@/store'
const props = withDefaults(defineProps<{
  skill: string
}>(), {
  skill: ''
})
const state = reactive({
  pos: 1,
  xStart: 0,
  xEnd: 0,
  yStart: 0,
  yEnd: 0,
  getResource: false,
  noYaoStop: false,
  hit: JSON.parse(localStorage.getItem('hit') || '[]'),
  dontHit: false,
  isHangup: false,
  hideP: false,
  kite: false,
  keepMinHP: 0
})

watch(state, () => {
  localStorage.setItem('hit', JSON.stringify(state.hit))
})

const hitOptions = computed(() => {
  const monster = store.state.monsterMap.find(mp => mp.map == store.state.pos.name)?.monster || []
  return monster.map(m => ({ label: m, value: m }))
})
const pos = computed(() => store.state.pos)
const player = computed(() => store.state.player)

let toX = -1
let toY = -1
let target = ''
let lastDo = 0

setInterval(() => {
  if (!state.isHangup) return
  const now = Date.now()
  // 1秒没动静了
  if (now - lastDo > 3000) {
    toX = -1
    toY = -1
    target = ''
    loop()
  }
}, 3000)

const work = new Worker('/work.js')
work.onmessage = (e) => {
  loop()
}
setInterval(() => {
  work.postMessage('keep')
}, 10)

let unit = {}
const loop = () => {
  if (!state.isHangup) return
  if (state.dontHit && !state.getResource) {
    state.isHangup = false
    return
  }
  let oldUnit
  if (target) {
    oldUnit = store.state.units.find(item => item.id == target)
    if (!oldUnit) {
      target = ''
      toX = -1
      toY = -1
    }
  }
  if (state.dontHit) {
    unit = store.state.units.find(item => item.type == 'herb')
  } else {
    const units = store.state.units.filter(item => ['herb', 'm1', 'm2', 'm3', 'm4'].includes(item.type))
    if (state.hit.length == 0) {
      unit = units.find(item => ['m1', 'm2', 'm3', 'm4'].includes(item.type) || (state.getResource ? item.type == 'herb':false))
    } else {
      unit = units.find(item => state.hit.includes(item.name) || (state.getResource ? item.type == 'herb':false))
    }
  }
  if (player.value.hp_c > state.keepMinHP) {
    if ((oldUnit || unit) && state.kite) {
      kiteMonster(oldUnit || unit)
      return
    }
  }
  if (oldUnit && unit && oldUnit.distance < unit.distance) {
    unit = oldUnit
  }
  if (player.value.hp_c > state.keepMinHP) {
    if (unit && unit.distance <= player.value.attackDistance) {
      if ((Date.now() - lastDo) < 650 * (1 - player.value.attackSpeed)) {
        return
      }
      lastDo = Date.now()
      lastMove = Date.now()
      target = unit.id
      request({
        url: '/hey',
        method: 'post',
        data: { id: unit.id, x: unit.x, y: unit.y, sklid: props.skill, hideP: state.hideP }
      })
      return
    }
  }
  move()
}
let lastMove = 0
const move = () => {
  if (!state.isHangup) return
  if ((Date.now() - lastMove) < 610) {
    return
  }
  lastMove = Date.now()
  lastDo = Date.now()
  if (pos.value.x == toX && pos.value.y == toY) {
    toX = -1
    toY = -1
  }
  let x = 0
  let y = 0
  if (toX == -1 && toY == -1) {
    // 范围打怪
    if (state.pos == 2) {
      x = randomNum(state.xStart, state.xEnd) || 0
      y = randomNum(state.yStart, state.yEnd) || 0
    } else {
      x = randomNum(0, pos.value.sizeX) || 0
      y = randomNum(0, pos.value.sizeY) || 0
    }
    toX = x
    toY = y
  } else {
    if (unit) {
      x = unit.x
      y = unit.y
    } else {
      x = toX
      y = toY
    }
  }
  request({
    url: '/go',
    method: 'post',
    data: { x, y, hideP: state.hideP }
  })
}
// 根据步数计算可攻击目标最远的坐标点
let kiteToX = -1
let kiteToY = -1
const getEndXY = function(step = 0, x = 0, y = 0, toX = 0, toY = 0, attackDistance = 0, isFar = true) {
  let endX = 0
  let endY = 0
  let dis = 999
  for(let xx = toX - attackDistance;xx <= toX + attackDistance;xx++) {
    if (xx < 0 || xx >= pos.value.sizeY) {
      continue
    }
    for(let yy = toY - attackDistance;yy <= toY + attackDistance;yy++) {
      if (yy < 0 || yy >= pos.value.sizeX) {
        continue
      }
      if (attackDistance == Math.floor(Math.sqrt(Math.pow(xx - toX, 2) + Math.pow(yy - toY, 2)))) {
        const d = Math.floor(Math.sqrt(Math.pow(xx - x, 2) + Math.pow(yy - y, 2)))
        if (d < dis) {
          dis = d
          endX = xx
          endY = yy
        }
      }
    }
  }
  kiteToX = endX
  kiteToY = endY
  return { endX, endY }
}
const kiteMonster = (unit: any) => {
  if (pos.value.x == kiteToY && pos.value.y == kiteToX) {
    kiteToX = -1
    kiteToY = -1
  }
  target = unit.id
  const distance = unit.distance - player.value.attackDistance
  if (distance == 0) {
    if ((Date.now() - lastDo) < 650 * (1 - player.value.attackSpeed)) {
      return
    }
    lastDo = Date.now()
    lastMove = Date.now()
    request({
      url: '/hey',
      method: 'post',
      data: { id: unit.id, x: unit.x, y: unit.y, sklid: props.skill, hideP: state.hideP }
    })
  } else if (kiteToX != -1 && kiteToY != -1) {
    if ((Date.now() - lastMove) < 610) {
      return
    }
    lastMove = Date.now()
    lastDo = Date.now()
    request({
      url: '/go',
      method: 'post',
      data: { x: kiteToY, y: kiteToX, hideP: state.hideP }
    })
  } else {
    if ((Date.now() - lastMove) < 610) {
      return
    }
    lastMove = Date.now()
    lastDo = Date.now()
    const { endX, endY } = getEndXY(player.value.speed, pos.value.y, pos.value.x, unit.y, unit.x, player.value.attackDistance, distance > 0)
    request({
      url: '/go',
      method: 'post',
      data: { x: endY, y: endX, hideP: state.hideP }
    })
  }
}
const handleStopHangup = () => {
  target = ''
  state.isHangup = false
  kiteToX = -1
  kiteToY = -1
  toX = -1
  toY = -1
}
</script>