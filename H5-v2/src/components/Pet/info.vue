<template>
  <h3 :style="{ color: getColor(pet.quality) }">
    Lv.{{pet.lv}} {{pet.name}}
  </h3>
  <div v-if="pet.exp">经验：{{pet.exp_c}}/{{pet.exp}}</div>
  <div><span>HP：{{pet.hp}}</span>（{{formatDouble(pet.hpGrow || pet.grow[0])}}）</div>
  <div><span>MP：{{pet.mp}}</span>（{{formatDouble(pet.mpGrow || pet.grow[1])}}）</div>
  <div><span>物攻：{{pet.atk}}</span>（{{formatDouble(pet.atkGrow || pet.grow[2])}}）</div>
  <div><span>法攻：{{pet.magic}}</span>（{{formatDouble(pet.magicGrow || pet.grow[3])}}）</div>
  <div><span>物防：{{pet.def}}</span>（{{formatDouble(pet.defGrow || pet.grow[4])}}）</div>
  <div><span>速度：{{pet.speed}}</span>（{{formatDouble(pet.speedGrow || pet.grow[5])}}）</div>
  <div>法抗：{{formatPercent(pet.magicDef)}}</div>
  <div>技能：{{formatPetSkillName(pet.skills)}}</div>
</template>
<script>
import { formatPercent } from '@/util/tools'
import SkillData from '@/data/skill.json'
import { petQualityMap } from '@/util/enum'
export default {
  props: {
    pet: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formatPercent,
      formatDouble(val) {
        return Math.floor(val)
      },
      formatPetSkillName(sklIdArr) {
        const names = []
        sklIdArr.map(sklId => {
          const skl = SkillData.find(skl => skl._id === sklId) || {}
          names.push(skl.name || '未知')
        })
        return names.join('，')
      },
      getColor(quality) {
        const map = petQualityMap[quality]
        if (map) {
          return map.color
        }
      }
    }
  }
}
</script>
<style scoped lang="less">

</style>
