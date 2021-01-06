<template>
  <a-card :title="playerSect.name || '请选择门派加入'" class="sect" size="small">
    <div v-if="playerSect.name">
      {{playerSect}}
      <a-popover :title="skill.name" v-for="skill in playerSect.skls" :key="skill.id">
        <template #content>
          <span style="padding-left: 8px;">{{skill.mark || skill.name}}</span>
        </template>
        <a-button class="sect_item_skill">
          {{skill.name}}
        </a-button>
      </a-popover>
    </div>
    <div v-else>
      <a-card-grid v-for="(sect, index) in sectList" :key="index" class="sect_item">
        <p style="font-weight: bold;font-size: 16px;margin: 0;">【{{sect.name}}】</p>
        <a-popover :title="skill.name" v-for="skill in sect.skls" :key="skill.id">
          <template #content>
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
import { joinSect, getSectSkill } from '@/api/player'
import { message } from 'ant-design-vue'
import { formatPercent } from '@/util/tools'
export default defineComponent({
  setup() {
    const store = useStore()

    const playerSect = reactive({ name: null, skls: [] })

    const buildPlayerSect = async (sect) => {
      if (sect) {
        const { name, skills } = SectData.find(sd => sd._id === sect)
        const skls = []
        const { data: playerSectSkills } = await getSectSkill()
        skills.map(temp => {
          const [sklid, preskl, lv] = temp
          const skl = SkillData.find(sd => sklid === sd._id)
          const learned = playerSectSkills.find(pss => pss.sklId === sklid)
          const lvUpDesc = []
          if (learned) {
            // 组装升级说明
            const { lvUpConfig } = learned
            if (lvUpConfig['consumeHp']) {
              lvUpDesc.push(`HP消耗降低${formatPercent(lvUpConfig['consumeHp'])}`)
            }
            if (lvUpConfig['atkUp']) {
              lvUpDesc.push(`物理攻击威力+${formatPercent(lvUpConfig['atkUp'])}`)
            }
            if (lvUpConfig['critsDamageRate']) {
              lvUpDesc.push(`暴击伤害+${formatPercent(lvUpConfig['critsDamageRate'])}`)
            }
            if (lvUpConfig['magicUp']) {
              lvUpDesc.push(`法术攻击威力+${formatPercent(lvUpConfig['magicUp'])}`)
            }
            if (lvUpConfig['fixedHurt']) {
              lvUpDesc.push(`固定伤害+${lvUpConfig['fixedHurt']}`)
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
          }
          skls.push({
            lv,
            name: skl.name,
            mark: skl.mark,
            learned,
            lvUpDesc
          })
        })
        playerSect.name = name
        playerSect.skls = skls
      } else {
        playerSect.value = {}
      }
    }

    const computedSect = computed(() => store.state.user.sect)
    if (computedSect.value) {
      buildPlayerSect(computedSect.value)
    }
    watch(computedSect, () => {
      buildPlayerSect(computedSect.value)
    })

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
      } catch (e) {
        console.error(e)
      }
    }

    return {
      sectList,
      playerSect,
      handleJoinSect
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
    }
  }
}
</style>

