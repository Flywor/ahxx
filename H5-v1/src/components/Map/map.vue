<template>
  <div class="container">
    <div
      class="map"
    >
      <div
        v-for="(d, i) in data"
        :key="i"
        class="map-line"
        :style="{ height: `${unitSize}px` }"
      >
        <div
          v-for="(dd, ii) in d"
          :key="`${i}-${ii}`"
          class="map-line-block"
          :style="{
            background: `#${dd[4]}`,
            width: `${unitSize}px`,
            height: '100%'
          }"
          @click="() => handleMove(dd)"
        >
        </div>
      </div>
    </div>
    <div
      v-for="us in mapUsers"
      :key="us.username"
      :class="{ 'map-man': true, 'run': true }"
      :style="{
        width: `${unitSize}px`,
        height: `${unitSize}px`,
        left: `${us.y * unitSize}px`,
        top: `${us.x * unitSize - unitSize / 2}px`,
        transition: `left ${us.moveTime}s linear, top ${us.moveTime}s linear`
      }"
    >
      <span>
        {{us.username}}
      </span>
    </div>
  </div>
</template>
<script>
import * as MapAPI from '@/api/map'

export default {
  data() {
    return {
      unitSize: 16,
      data: [],
      moveTime: 0,
      mapUsers: []
    }
  },
  watch: {
    '$store.state.mapUsers': {
      deep: true,
      immediate: true,
      handler(n, o) {
        if (!o) {
          this.mapUsers = JSON.parse(JSON.stringify(n))
          return
        }
        const mapUsers = []
        n.map(us => {
          const old = o.find(oldus => oldus.username === us.username)
          if (!old) {
            mapUsers.push({ ...us })
          } else {
            const moveTime = Math.sqrt(Math.pow(us.x - old.x, 2) + Math.pow(us.y - old.y, 2)) / 6
            mapUsers.push({ ...us, moveTime })
          }
        })
        this.mapUsers = mapUsers
      }
    }
  },
  async mounted() {
    const data = await fetch('./1.json').then(d => d.json())
    this.data = data.data
  },
  methods: {
    handleMove(point) {
      const [x, y] = point
      MapAPI.move(x, y)
    }
  }
}
</script>
<style scoped lang="less">
.container {
  position: relative;
  .map {
    display: inline-block;
    margin: 0 auto;
    background: #f1f1f1;
    &-line {
      line-height: 0;
      &-block {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }
    }
  }
  .map-man {
    font-family: 'ZCOOLKuaiLe-Regular';
    position: absolute;
    font-size: 14px;
    span {
      display: block;
      white-space: nowrap;
      width: 300%;
      height: 100%;
      display: inline-block;
      text-align: center;
      margin-left: -100%;
    }
  }
  .run span {
    animation: manframe .6s infinite;
  }
  @keyframes manframe {
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(0, 4px) rotate(20deg); }
    50% { transform: translate(4px, 4px) rotate(0deg); }
    75% { transform: translate(0, 4px) rotate(-20deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
}
</style>
