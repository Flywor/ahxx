<template>
  <a-card :title="playerSect.name || '请选择门派加入'" class="sect" size="small">
    <div v-if="playerSect.name">
      <a-card-grid v-for="(skill, index) in playerSect.skls" :key="index" class="sect_item">
        <strong>【{{skill.skl.name}}】</strong>
        <div>{{skill.skl.mark || '作者没写简介'}}</div>
        <div>技能类型：{{skillTypeMap[skill.skl.type]}}</div>
        <div v-if="skill.learned" class="sect_item_skill_desc">
          <div>当前等级：{{skill.learned.lv}}<span v-if="skill.learned.extLv">+{{skill.learned.extLv}}</span></div>
          <SkillDetail :skill="skill.learned" />
          <div>下一级：{{skill.lvUpDesc.join('，')}}</div>
          <div>升级消耗：经验{{skill.lvUpExp}}，金币{{skill.lvUpGold}}</div>
          <a-button size="small" type="primary" @click="() => handleLvUpSectSkill(skill.id)">
            升级
          </a-button>
        </div>
        <div v-else>
          <SkillDetail :skill="skill.skl" />
          <div>学习等级：{{skill.lv}}</div>
          <a-button type="primary" size="small" @click="() => handleLearnSkill(skill.id)">学习</a-button>
        </div>
      </a-card-grid>
    </div>
    <div v-else>
      <a-card-grid v-for="(sect, index) in sectList" :key="index" class="sect_item">
        <p style="font-weight: bold;font-size: 16px;margin: 0;">【{{sect.name}}】</p>
        <a-popover :title="skill.skl.name" v-for="skill in sect.skls" :key="skill.id">
          <template #content>
            <span style="padding-left: 8px;">技能类型：{{skillTypeMap[skill.skl.type]}}</span>
            <span style="padding-left: 8px;">{{skill.skl.mark || '作者没写简介'}}</span>
            <SkillDetail :skill="skill.skl" />
          </template>
          <a-button class="sect_item_skill">
            {{skill.skl.name}}
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
import { reactive, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { joinSect, getSectSkill, learnSkill, lvUpSectSkill } from '@/api/player'
import { skillTypeMap } from '@/util/enum'
import SkillDetail from './skillDetail'
import { formatPercent } from '@/util/tools'
export default defineComponent({
  components: { SkillDetail },
  setup() {
    const store = useStore()

    const playerSect = reactive({ name: null, skls: [] })

    const buildPlayerSect = async() => {
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
          // 组装升级说明
          const lvUpConfig = JSON.parse(skl.lvUpConfig || '{}')
          if (lvUpConfig['consumeHp']) {
            lvUpDesc.push(`HP消耗增加${formatPercent(lvUpConfig['consumeHp'])}`)
          }
          if (lvUpConfig['consumeMp']) {
            lvUpDesc.push(`MP消耗增加${lvUpConfig['consumeMp']}`)
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
            lvUpDesc.push(`复活HP+${formatPercent(lvUpConfig['reviveHp'])}`)
          }
          if (lvUpConfig['recoveryHp']) {
            lvUpDesc.push(`HP恢复+${lvUpConfig['recoveryHp']}`)
          }
          if (lvUpConfig['recoveryMp']) {
            lvUpDesc.push(`MP恢复+${lvUpConfig['recoveryMp']}`)
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
          if (learned) {
            lvUpExp = Math.pow(learned.lv * 5, 3)
            lvUpGold = Math.pow(learned.lv * 3, 3)
          }
          skls.push({
            id: skl._id,
            lv,
            skl,
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
          skl
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
      skillTypeMap
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

