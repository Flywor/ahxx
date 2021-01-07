<template>
  <a-card :title="playerSect.name || '请选择门派加入'" class="sect" size="small">
    <div v-if="playerSect.name">
      <a-card-grid v-for="(skill, index) in playerSect.skls" :key="index" class="sect_item">
        <strong>【{{skill.name}}】</strong>
        <div>{{skill.mark || skill.name}}</div>
        <div>技能类型：{{skillTypeMap[skill.type]}}</div>
        <div v-if="skill.learned" class="sect_item_skill_desc">
          <div>当前等级：{{skill.learned.lv}}<span v-if="skill.learned.extLv">+{{skill.learned.extLv}}</span></div>
          <div v-if="skill.learned.consumeHp">消耗HP：{{skill.learned.consumeHp}}<span v-if="skill.learned.reduceConsumeHp">-{{formatPercent(skill.learned.reduceConsumeHp)}}</span></div>
          <div v-if="skill.learned.consumeMp">消耗MP：{{skill.learned.consumeMp}}<span v-if="skill.learned.reduceConsumeMp">-{{skill.learned.reduceConsumeMp}}</span></div>
          <div v-if="skill.learned.attackTimes">伤害次数：{{skill.learned.attackTimes}}<span v-if="skill.learned.extAttackTimes">+{{skill.learned.extAttackTimes}}</span></div>
          <div v-if="skill.learned.ability">目标数量：{{skill.learned.ability}}<span v-if="skill.learned.extAbility">+{{skill.learned.extAbility}}</span></div>
          <div v-if="skill.learned.round">持续回合：{{skill.learned.round}}<span v-if="skill.learned.extRound">+{{skill.learned.extRound}}</span></div>
          <div v-if="skill.learned.dot">回合伤害：{{skill.learned.dot}}<span v-if="skill.learned.extDot">+{{skill.learned.extDot}}</span></div>
          <div v-if="skill.learned.reviveHp">复活HP：{{formatPercent(skill.learned.reviveHp)}}<span v-if="skill.learned.reviveHp">+{{formatPercent(skill.learned.reviveHp)}}</span></div>
          <div v-if="skill.learned.recoveryHp">恢复HP：{{skill.learned.recoveryHp}}<span v-if="skill.learned.extRecoveryHp">+{{skill.learned.extRecoveryHp}}</span></div>
          <div v-if="skill.learned.recoveryMp">恢复MP：{{skill.learned.recoveryMp}}<span v-if="skill.learned.extRecoveryMp">+{{skill.learned.extRecoveryMp}}</span></div>
          <div v-if="skill.learned.fixedHurt">固定伤害：{{skill.learned.fixedHurt}}<span v-if="skill.learned.extFixedHurt">+{{skill.learned.extFixedHurt}}</span></div>
          <div v-if="skill.learned.critsRate">暴击几率：{{skill.learned.critsRate}}<span v-if="skill.learned.extCritsRate">+{{skill.learned.extCritsRate}}</span></div>
          <div v-if="skill.learned.critsDamageRate">暴击伤害：{{skill.learned.critsDamageRate}}<span v-if="skill.learned.extCritsDamageRate">+{{skill.learned.extCritsDamageRate}}</span></div>
          <div v-if="skill.learned.atkUp">物攻加成：{{formatPercent(skill.learned.atkUp)}}<span v-if="skill.learned.extAtkUp">+{{formatPercent(skill.learned.extAtkUp)}}</span></div>
          <div v-if="skill.learned.magicUp">法攻加成：{{formatPercent(skill.learned.magicUp)}}<span v-if="skill.learned.extMagicUp">+{{formatPercent(skill.learned.extMagicUp)}}</span></div>
          <div v-if="skill.learned.defUp">防御倍率：{{formatPercent(skill.learned.defUp)}}</div>
          <div v-if="skill.learned.agiUp">速度倍率：{{formatPercent(skill.learned.agiUp)}}</div>
          <div v-if="skill.learned.attackMp">伤害削减MP：{{formatPercent(skill.learned.attackMp)}}</div>
          <div v-if="skill.learned.hit">命中率：{{formatPercent(skill.learned.hit)}}<span v-if="skill.learned.extHit">+{{formatPercent(skill.learned.extHit)}}</span></div>
          <div>下一级：{{skill.lvUpDesc.join('，')}}</div>
          <div>升级消耗：经验{{skill.lvUpExp}}，金币{{skill.lvUpGold}}</div>
          <a-button size="small" type="primary" @click="() => handleLvUpSectSkill(skill.id)">
            升级
          </a-button>
        </div>
        <div v-else>
          <div>学习等级：{{skill.lv}}</div>
          <a-button type="primary" size="small" @click="() => handleLearnSkill(skill.id)">学习</a-button>
        </div>
      </a-card-grid>
    </div>
    <div v-else>
      <a-card-grid v-for="(sect, index) in sectList" :key="index" class="sect_item">
        <p style="font-weight: bold;font-size: 16px;margin: 0;">【{{sect.name}}】</p>
        <a-popover :title="skill.name" v-for="skill in sect.skls" :key="skill.id">
          <template #content>
            <span style="padding-left: 8px;">技能类型：{{skillTypeMap[skill.type]}}</span>
            <span style="padding-left: 8px;">{{skill.mark || skill.name}}</span>
          </template>
          <a-button class="sect_item_skill">
            {{skill.name}}
          </a-button>
        </a-popover>
        <div>
          <a-button type="primary" size="small" @click="() => handleJoinSect(sect._id)">
            加入门派
          </a-button>
        </div>
      </a-card-grid>
    </div>
  </a-card>
</template>

<script>
import SkillData from '@/data/skill.json'
import SectData from '@/data/sect.json'
import { reactive, ref, defineComponent, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { joinSect, getSectSkill, learnSkill, lvUpSectSkill } from '@/api/player'
import { message } from 'ant-design-vue'
import { formatPercent } from '@/util/tools'
import { skillTypeMap } from '@/util/enum'
export default defineComponent({
  setup() {
    const store = useStore()

    const playerSect = reactive({ name: null, skls: [] })

    const buildPlayerSect = async () => {
      if (store.state.user.sect) {
        const { name, skills } = SectData.find(sd => sd._id === store.state.user.sect)
        const skls = []
        const { data: playerSectSkills } = await getSectSkill()
        skills.map(temp => {
          const [sklid, preskl, lv] = temp
          const skl = SkillData.find(sd => sklid === sd._id)
          const learned = playerSectSkills.find(pss => pss.sklId === sklid)
          const lvUpDesc = []
          let lvUpExp = 0
          let lvUpGold = 0
          if (learned) {
            // 组装升级说明
            const { lvUpConfig } = learned
            if (lvUpConfig['consumeHp']) {
              lvUpDesc.push(`HP消耗降低${formatPercent(lvUpConfig['consumeHp'])}`)
            }
            if (lvUpConfig['consumeMp']) {
              lvUpDesc.push(`MP消耗降低${formatPercent(lvUpConfig['consumeMp'])}`)
            }
            if (lvUpConfig['atkUp']) {
              lvUpDesc.push(`物攻加成+${formatPercent(lvUpConfig['atkUp'])}`)
            }
            if (lvUpConfig['magicUp']) {
              lvUpDesc.push(`法攻加成+${formatPercent(lvUpConfig['magicUp'])}`)
            }
            if (lvUpConfig['critsRate']) {
              lvUpDesc.push(`暴击几率+${formatPercent(lvUpConfig['critsRate'])}`)
            }
            if (lvUpConfig['critsDamageRate']) {
              lvUpDesc.push(`暴击伤害+${formatPercent(lvUpConfig['critsDamageRate'])}`)
            }
            if (lvUpConfig['fixedHurt']) {
              lvUpDesc.push(`固定伤害+${lvUpConfig['fixedHurt']}`)
            }
            if (lvUpConfig['reviveHp']) {
              lvUpDesc.push(`复活HP+${lvUpConfig['reviveHp']}`)
            }
            if (lvUpConfig['recoveryHp']) {
              lvUpDesc.push(`HP恢复+${lvUpConfig['recoveryHp']}`)
            }
            if (lvUpConfig['recoveryMp']) {
              lvUpDesc.push(`MP恢复+${lvUpConfig['recoveryHp']}`)
            }
            if (lvUpConfig['dot']) {
              lvUpDesc.push(`回合伤害+${lvUpConfig['dot']}`)
            }
            if (lvUpConfig['hit']) {
              lvUpDesc.push(`命中率+${formatPercent(lvUpConfig['hit'])}`)
            }
            if (lvUpConfig['attackTimes']) {
              lvUpDesc.push(`伤害次数+${lvUpConfig['attackTimes']}`)
            }
            if (lvUpConfig['ability']) {
              lvUpDesc.push(`目标数量+${lvUpConfig['ability']}`)
            }
            if (lvUpConfig['round']) {
              lvUpDesc.push(`持续回合+${lvUpConfig['round']}`)
            }
            if (lvUpConfig['ability']) {
              lvUpDesc.push(`目标数量+${lvUpConfig['ability']}`)
            }
            lvUpExp = Math.pow(learned.lv * 5, 3),
            lvUpGold = Math.pow(learned.lv * 3, 3)
          }
          skls.push({
            id: skl._id,
            lv,
            name: skl.name,
            mark: skl.mark,
            type: skl.type,
            learned,
            lvUpDesc,
            lvUpExp,
            lvUpGold
          })
        })
        playerSect.name = name
        playerSect.skls = skls
      } else {
        playerSect.value = {}
      }
    }

    buildPlayerSect()

    const sectList = SectData.map(sect => {
      const { _id, name, skills } = sect
      const skls = []
      skills.map(temp => {
        const [sklid, preskl, lv] = temp
        const skl = SkillData.find(sd => sklid === sd._id)
        skls.push({
          lv,
          name: skl.name,
          mark: skl.mark
        })
      })
      return {
        _id,
        name,
        skls
      }
    })

    const handleJoinSect = async(_id) => {
      try {
        await joinSect(_id)
        buildPlayerSect()
      } catch (e) {
        console.error(e)
      }
    }

    const handleLearnSkill = async(_id) => {
      try {
        await learnSkill(_id)
        buildPlayerSect()
      } catch (e) {
        console.error(e)
      }
    }

    const handleLvUpSectSkill = async(_id) => {
      try {
        await lvUpSectSkill(_id)
        buildPlayerSect()
      } catch (e) {
        console.error(e)
      }
    }

    return {
      sectList,
      playerSect,
      handleJoinSect,
      handleLearnSkill,
      handleLvUpSectSkill,
      skillTypeMap,
      formatPercent
    }
  }
})
</script>
<style lang="less" scoped>
.sect /deep/ .ant-card-body{
  overflow-y: scroll!important;
  height: calc(100% - 38px)!important;
  margin-right: -10px;
}
.sect {
  height: 100%;
  width: 100%;
  &_item {
    width: 25%;
    padding: 8px;
    text-align: center;
    &_skill {
      width: 128px;
      margin: 4px;
      &_desc {
        span {
          color: red;
        }
      }
    }
  }
}
</style>

