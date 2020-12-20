<template>
  <div class="battle-skill">
    <div class="battle-skill-container">
      <p>
        选择 <a>{{playerAction.playerTarget ? '宠物': '玩家'}}</a> 技能 目标
        <a-checkbox
          :checked="autoBattle"
          style="margin-left: 32px;"
          @change="() => {
            $store.commit('setAutoBattle', !autoBattle)
          }"
        >
          自动战斗
        </a-checkbox>
      </p>
      <a-button
        class="battle-skill-container-item"
        v-for="skill in actionSkill"
        :key="skill.id"
        :disabled="isEnd || !showPlayerAction"
        :type="selectedSkill.id === skill.id ? 'primary': null"
        @click="() => handleSelectSkill(skill)"
      >
        {{skill.name}}
      </a-button>
    </div>
  </div>
  <div class="battle">
    <div class="left">
      <div
        class="player"
        v-for="(u, i) in our"
        :key="`left-${i}`"
      >
        <label
          v-for="(uu, ii) in u"
          :key="`left-${ii}`"
          :class="{
            'unit': true,
            'unit-left': ii % 2 === 0,
            'unit-right': ii % 2 === 1,
            'target-flag': selectedSkill.target == 1
          }"
          @click="() => handleSelectTarget(uu.id)"
        >
          Lv.{{uu.lv}} {{uu.name}}
          <div class="hp">
            <span :style="{ width: `${uu.hp_c / uu.hp * 100}%` }" />
            <label>{{uu.hp_c}}/{{uu.hp}}</label>
          </div>
        </label>
      </div>
    </div>
    <div class="center">
      <div class="actions">
        <p>第{{round}}回合</p>
      </div>
      <div v-if="!isEnd && showPlayerAction && timeout > 0" class="timeout">{{timeout}}</div>
      <div v-else-if="isEnd">
        结算中
      </div>
      <div v-else>
        请等待
      </div>
    </div>
    <div class="right">
      <div
        class="player"
        v-for="(u, i) in enemy"
        :key="`left-${i}`"
      >
        <label
          v-for="(uu, ii) in u"
          :key="`left-${ii}`"
          :class="{
            'unit': true,
            'unit-left': ii % 2 === 1,
            'unit-right': ii % 2 === 0,
            'target-flag': (uu.hp_c > 0 && selectedSkill.target == 0)
          }"
          @click="() => handleSelectTarget(uu.id)"
        >
          Lv.{{uu.lv}} {{uu.name}}
          <div class="hp">
            <span :style="{ width: `${uu.hp_c / uu.hp * 100}%` }" />
            <label>{{uu.hp_c}}/{{uu.hp}}</label>
          </div>
        </label>
      </div>
    </div>
  </div>
  <div class="info">
    <div class="battle_info">
      <h3 v-if="round > 1">&nbsp;&nbsp;战况：第{{round - 1}}回合</h3>
      <div v-for="(act, i) in actions" :key="`actions-${i}`">
        <label v-html="act.title" />：
        <label v-html="act.content.join('，')" />
      </div>
    </div>
    <div class="end_info">
      推送战斗总结
      <div v-for="(item, index) in battleEarnings" :key='index'>{{`第${index+1}次战斗获得${item}`}}</div>
      <div id="info_end" style="height:0px; overflow:hidden" ref="end"/>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { roundMonsterOperation } from '@/api/team'
export default defineComponent({
  data() {
    return {
      timeout: 0,
      round: 1,
      showPlayerAction: true,
      selectedSkill: {},
      playerAction: {
        playerSkill: null,
        playerTarget: null,
        petSkill: null,
        petTarget: null
      }
    }
  },
  computed: {
    autoBattle() {
      return this.$store.state.autoBattle
    },
    battle() {
      return this.$store.state.battle || {}
    },
    our() {
      const arr = this.battle.our || []
      const formation = []
      arr.map(unit => {
        if (unit.monsterId) {
          formation[formation.length - 1].push(unit)
        } else {
          formation.push([unit])
        }
      })
      return formation
    },
    enemy() {
      const arr = this.battle.enemy || []
      const formation = []
      // TODO 是玩家队伍
      if (arr.some(a => a.monsterId)) {
        console.log('玩家队伍没做')
      } else {
        arr.map((unit, i) => {
          if (i <= 4) {
            formation.push([unit])
          } else {
            formation[Math.abs(i - 5)].push(unit)
          }
        })
      }
      return formation
    },
    actions() {
      return this.$store.state.actions
    },
    maxRoundTimeout() {
      return this.battle.maxRoundTimeout / 1000
    },
    actionSkill() {
      const playerSkills = this.$store.state.skills
      const petSkills = this.$store.state.battlePet.skills
      if (!petSkills) {
        return playerSkills
      }
      if (this.playerAction.playerSkill) {
        return petSkills
      } else {
        return playerSkills
      }
    },
    isEnd() {
      return this.battle.end
    },
    battleEarnings() {
      return this.$store.state.earnings
    }
  },
  mounted() {
    setInterval(() => {
      if (this.timeout >= 0) {
        this.timeout--
        if (this.timeout === (this.maxRoundTimeout - 3) && this.autoBattle) {
          this.playerAction = { ...this.$store.state.cachePlayerAction }

          if (!this.playerAction.playerSkill) {
            const playerSkills = this.$store.state.skills
            this.playerAction.playerSkill = playerSkills[0].id
          }

          const petSkills = this.$store.state.battlePet.skills
          if (!this.playerAction.petSkill && petSkills) {
            this.playerAction.petSkill = petSkills[0].id
          }

          this.sendRoundOperation()
        }
        if (this.timeout < 3) {
          this.$store.commit('setAutoBattle', true)
        }
      }
    }, 1000)
    this.timeout = this.maxRoundTimeout
  },
  watch: {
    '$store.state.actions': {
      deep: true,
      handler(acts) {
        this.round++
        this.timeout = this.maxRoundTimeout
        this.showPlayerAction = true
      }
    },
    'battleEarnings': {
      handler(val) {
        if (val.length) {
          const dom = this.$refs.end
          console.log(dom)
          dom.scrollIntoView()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSelectSkill(skill) {
      const petSkills = this.$store.state.battlePet.skills
      if (skill.ability) {
        this.selectedSkill = skill
      } else {
        if (this.playerAction.playerSkill) {
          this.playerAction.petSkill = skill.id
          this.playerAction.petTarget = null
          this.sendRoundOperation()
        } else {
          this.playerAction.playerSkill = skill.id
          this.playerAction.playerTarget = null
          if (petSkills) {
            this.selectedSkill = petSkills[0]
          } else {
            this.sendRoundOperation()
          }
        }
      }
    },
    handleSelectTarget(target) {
      if (!this.selectedSkill.id) return
      const petSkills = this.$store.state.battlePet.skills
      if (this.playerAction.playerSkill) {
        this.playerAction.petSkill = this.selectedSkill.id
        this.playerAction.petTarget = target
        this.sendRoundOperation()
      } else {
        this.playerAction.playerSkill = this.selectedSkill.id
        this.playerAction.playerTarget = target
        if (petSkills) {
          this.selectedSkill = petSkills[0]
        } else {
          this.sendRoundOperation()
        }
      }
    },
    sendRoundOperation() {
      this.showPlayerAction = false
      const pa = this.playerAction
      // 无目标技能缓存，自动战斗用
      this.$store.commit('setCachePlayerAction', {
        playerSkill: pa.playerSkill,
        playerTarget: null,
        petSkill: pa.petSkill,
        petTarget: null
      })
      roundMonsterOperation(pa)
      this.playerAction = {
        playerSkill: null,
        playerTarget: null,
        petSkill: null,
        petTarget: null
      }
      this.selectedSkill = {}
    }
  }
})
</script>

<style lang="less" scoped>
.battle-skill {
  margin-top: 8px;
  &-container {
    background: aliceblue;
    padding: 8px;
    text-align: center;
    &-item {
      display: inline-block;
      width: 100px;
      margin: 0 8px 8px;
    }
  }
}
.battle {
  background: aliceblue;
  position: relative;
  height: 242px;
  display: flex;
  justify-content: center;
  align-items: center;
  .left, .right {
    padding: 0 16px;
    flex: 1;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    .player {
      position: relative;
      height: 33px;
      margin: 8px 0;
      .unit-left {
        left: 0;
      }
      .unit-right {
        right: 0;
      }
      .unit {
        position: absolute;
        top: 0;
        bottom: 0;
        border: 1px solid transparent;
        padding: 4px;
        border-radius: 4px;
        width: 49%;
        text-align: center;
        .hp {
          position: absolute;
          top: -15px;
          left: 0;
          right: 0;
          border: 1px solid #E3EAF0;
          border-radius: 5px;
          height: 16px;
          line-height: 14px;
          width: 140px;
          margin: 0 auto;
          label {
            position: absolute;
            right: 0;
            left: 0;
          }
          span {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: #87D068;
            transition: width 1s;
          }
        }
      }
    }
    .target-flag {
      transition: all .3s;
      cursor: pointer;
      border-color: grey!important;
    }
    .target-flag:hover {
      color: #1890FF;
      border-color: #1890FF!important;
    }
  }
  .center {
    text-align: center;
    width: 80px;
  }
}
.info{
  width: 100%;
  height: calc(100vh - 760px);
  display: flex;
  .battle_info{
    width: 50%;
  }
  .end_info{
    height: 100%;
    overflow-y: scroll;
  }
}
</style>
