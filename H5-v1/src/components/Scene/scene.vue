<template>
  <div class="scene">
    <man
      v-for="user in our"
      :key="user.id"
      :unit="user"
      :style="{
        left: `${user.left}%`,
        top: `${user.top}%`
      }"
    />
    <div class="timeout" v-if="showTimeout">{{timeout}}</div>
    <div class="vs">
      Round {{round}}
      <br />
      V S
    </div>
    <man
      v-for="monster in enemy"
      :key="monster.id"
      :unit="monster"
      :style="{
        left: `${monster.left}%`,
        top: `${monster.top}%`
      }"
    />
  </div>
</template>

<script>
import man from './man.vue'
import { defineComponent } from 'vue'
import { sleep } from '../../util/tools'
export default defineComponent({
  components: { man },
  data() {
    return {
      timeout: 30,
      showTimeout: true,
      round: 1
    }
  },
  computed: {
    our() {
      const our = []
      this.$store.state.battle.our.map((o, i) => {
        our.push({ ...o, left: 15, top: i * 15 + 15 })
      })
      return our
    },
    enemy() {
      const enemy = []
      this.$store.state.battle.enemy.map((e, i) => {
        enemy.push({ ...e, left: 75, top: i * 15 + 15 })
      })
      return enemy
    }
  },
  mounted() {
    setInterval(() => {
      this.timeout--
    }, 1000)
  },
  watch: {
    '$store.state.actions': {
      deep: true,
      handler(acts) {
        this.handleActionsRun(acts)
      }
    }
  },
  methods: {
    async handleActionsRun(acts) {
      this.showTimeout = false
      const unit = this.our.concat(this.enemy)
      for (let i = 0; i < acts.length; i++) {
        const act = acts[i]
        console.log(act)
        const actor = unit.find(u => u.id === act.actors)
        const actorTop = actor.top
        const actorLeft = actor.left
        const targets = act.target.map(tg => unit.find(u => u.id === tg.id))
        for (let t = 0; t < targets.length; t++) {
          const tg = targets[t]
          const tgTop = tg.top
          const tgLeft = tg.left
          actor.top = tgTop
          actor.left = tgLeft
          await sleep(300)
        }
        actor.top = actorTop
        actor.left = actorLeft
        await sleep(300)
        // actors: string
        // skill: string
        // target: Array<HurtModel>
      }
      this.round++
      this.showTimeout = true
      this.timeout = 30
    }
  }
})
</script>

<style lang="less" scoped>
.scene {
  position: relative;
  height: 100%;
  overflow: hidden;
  .timeout {
    position: absolute;
    left: 0%;
    top: 5%;
    font-size: 50px;
    width: 100%;
    text-align: center;
    animation: vsframe 1s infinite;
    color: #f37971;
  }
  .vs {
    position: absolute;
    left: 0;
    top: 30%;
    width: 100%;
    font-size: 60px;
    font-family: 'ZCOOLKuaiLe-Regular';
    animation: vsframe .5s infinite;
    color: #f7d770;
    text-align: center;
  }
  @keyframes vsframe {
    0% { transform: scale(1); text-shadow: 0 0 4px white, 0 -5px 4px #ff3, 2px -10px 6px #fd3, -2px -15px 11px #f80, 2px -25px 18px #f20; }
    25% { transform: scale(1.0); text-shadow: 0 0 4px white, 2px -7px 6px #ff3, 2px -12px 8px #fd3, -3px -20px 11px #f80, 4px -30px 22px #f20; }
    50% { transform: scale(0.9); text-shadow: 0 0 4px white, 2px -10px 8px #ff3, 2px -14px 10px #fd3, -4px -25px 11px #f80, 4px -35px 25px #f20; }
    75% { transform: scale(1.1); text-shadow: 0 0 4px white, 2px -7px 6px #ff3, 2px -12px 8px #fd3, -3px -20px 11px #f80, 4px -30px 22px #f20; }
    100% { transform: scale(1); text-shadow: 0 0 4px white, 0 -5px 4px #ff3, 2px -10px 6px #fd3, -2px -15px 11px #f80, 2px -25px 18px #f20; }
  }
}
</style>
