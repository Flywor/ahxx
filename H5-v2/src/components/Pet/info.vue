<template>
  <h3 :style="{ color: getColor(pet.quality) }">
    Lv.{{pet.lv}} {{pet.name}}
  </h3>
  <div v-if="pet.exp">经验：{{pet.exp_c}}/{{pet.exp}}</div>
  <div><span>HP：{{formatDouble(pet.hp)}}</span>（{{formatDouble(pet.grow ? pet.grow[0]: pet.hpGrow)}}）</div>
  <div><span>MP：{{formatDouble(pet.mp)}}</span>（{{formatDouble(pet.grow ? pet.grow[1]: pet.mpGrow)}}）</div>
  <div><span>物攻：{{formatDouble(pet.atk)}}</span>（{{formatDouble(pet.grow ? pet.grow[2]: pet.atkGrow)}}）</div>
  <div><span>法攻：{{formatDouble(pet.magic)}}</span>（{{formatDouble(pet.grow ? pet.grow[3]: pet.magicGrow)}}）</div>
  <div><span>物防：{{formatDouble(pet.def)}}</span>（{{formatDouble(pet.grow ? pet.grow[4]: pet.defGrow)}}）</div>
  <div><span>速度：{{formatDouble(pet.speed)}}</span>（{{formatDouble(pet.grow ? pet.grow[5]: pet.speedGrow)}}）</div>
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
