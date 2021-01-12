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
      <a-popover :title="skill.name" v-for="skill in actionSkill" :key="skill.id">
        <template #content>
          <span style="padding-left: 8px;">{{skill.mark || skill.name}}</span>
        </template>
        <a-button
          class="battle-skill-container-item"

          :disabled="isEnd || !showPlayerAction || skill.type === 8"
          :type="selectedSkill.id === skill.id ? 'primary': null"
          @click="() => handleSelectSkill(skill)"
        >
          {{skill.name}}
        </a-button>
      </a-popover>
    </div>
  </div>
  <div class="fight">
    <div class="fight_part">
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
              <div class="mp">
                <span :style="{ width: `${uu.mp_c / uu.mp * 100}%` }" />
                <label>{{uu.mp_c}}/{{uu.mp}}</label>
              </div>
            </label>
          </div>
        </div>
        <div class="center" v-if="round>0">
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
              :style="{ color: qualityMap[uu.quality].color }"
              @click="() => handleSelectTarget(uu.id)"
            >
              Lv.{{uu.lv}} {{uu.name}}
              <div class="hp">
                <span :style="{ width: `${uu.hp_c / uu.hp * 100}%` }" />
                <label>{{uu.hp_c}}/{{uu.hp}}</label>
              </div>
              <div class="mp">
                <span :style="{ width: `${uu.mp_c / uu.mp * 100}%` }" />
                <label>{{uu.mp_c}}/{{uu.mp}}</label>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="battle_info">
        <h3 v-if="round > 0">&nbsp;&nbsp;战况：第{{round}}回合</h3>
        <div v-for="(act, i) in actions" :key="`actions-${i}`">
          <label v-html="act.title" />：
          <label v-html="act.content.join('')" />
        </div>
      </div>
    </div>
    <div class="end_info">
      战斗收益
      <div v-for="(item, index) in battleEarnings" :key='index'>
        {{item.time}}
        获得经验
        <span>{{item.data.exp}}</span>
        <span v-if="item.data.equip && Object.values(item.data.equip).length">
          获得装备
          <span :style="{ color: qualityMap[item.data.equip.quality].color }">{{item.data.equip.name}}</span>
        </span>
        <span v-if="item.data.goods && item.data.goods.length">
          获得物品
          <span v-for="(ls, ind) in item.data.goods" :key='ind' :style="{ marginRight: '8px', color: qualityMap[ls.quality].color }">
            {{ls.name}}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { roundMonsterOperation } from '@/api/team'
import { qualityMap } from '@/util/enum'
export default defineComponent({
  data() {
    return {
      timeout: 0,
      round: 0,
      showPlayerAction: true,
      selectedSkill: {},
      playerAction: {
        playerSkill: null,
        playerTarget: null,
        petSkill: null,
        petTarget: null
      },
      qualityMap
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
      if (this.$store.state.earnings.lenght > 50) {
        this.$store.commit('clearEarnings')
        return {}
      }
      return this.$store.state.earnings
    }
  },
  mounted() {
    setInterval(() => {
      if (this.timeout >= 0) {
        this.timeout--
        if (this.autoBattle) {
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
        // this.round++
        this.timeout = this.maxRoundTimeout
        this.showPlayerAction = true
      }
    },
    '$store.state.battle': {
      handler(val) {
        if (val) {
          // console.log(val)
          this.round = val.round
        }
      },
      deep: true
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
      this.timeout = -1
      const pa = this.playerAction
      // 无目标技能缓存，自动战斗用
      this.$store.commit('setCachePlayerAction', {
        playerSkill: pa.playerSkill,
        playerTarget: pa.playerTarget,
        petSkill: pa.petSkill,
        petTarget: pa.petTarget
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
.fight{
  width: 100%;
  height: calc(100vh - 530px);
  display: flex;
  .fight_part{
    height: 100%;
    width: 70%;
    .battle_info{
      overflow-y: scroll;
      height: calc(100% - 240px);
    }
  }
  .end_info{
    height: 100%;
    width: 30%;
    overflow-y: scroll;
  }
}

.battle {
  // width: 70%;
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
        .hp, .mp {
          position: absolute;
          top: -22px;
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
            color: rgba(0, 0, 0, 0.65)!important;
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
        .mp {
          top: -8px;
          span {
            background: #86caff!important;
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

</style>
