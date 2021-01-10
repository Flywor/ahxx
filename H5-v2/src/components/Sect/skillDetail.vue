<template>
  <div v-if="skill.consumeHp">消耗HP：{{formatPercent(skill.consumeHp)}}<span v-if="skill.reduceConsumeHp">-{{formatPercent(skill.reduceConsumeHp)}}</span></div>
  <div v-if="skill.consumeMp">消耗MP：{{skill.consumeMp}}<span v-if="skill.reduceConsumeMp">-{{skill.reduceConsumeMp}}</span></div>
  <div v-if="skill.attackTimes">伤害次数：{{skill.attackTimes}}<span v-if="skill.extAttackTimes">+{{skill.extAttackTimes}}</span></div>
  <div v-if="skill.ability">目标数量：{{skill.ability}}<span v-if="skill.extAbility">+{{skill.extAbility}}</span></div>
  <div v-if="skill.round">持续回合：{{skill.round}}<span v-if="skill.extRound">+{{skill.extRound}}</span></div>
  <div v-if="skill.dot">回合伤害：{{skill.dot}}<span v-if="skill.extDot">+{{skill.extDot}}</span></div>
  <div v-if="skill.reviveHp">复活HP：{{formatPercent(skill.reviveHp)}}<span v-if="skill.extReviveHp">+{{formatPercent(skill.extReviveHp)}}</span></div>
  <div v-if="skill.recoveryHp">恢复HP：{{skill.recoveryHp}}<span v-if="skill.extRecoveryHp">+{{skill.extRecoveryHp}}</span></div>
  <div v-if="skill.recoveryMp">恢复MP：{{skill.recoveryMp}}<span v-if="skill.extRecoveryMp">+{{skill.extRecoveryMp}}</span></div>
  <div v-if="skill.fixedHurt">固定伤害：{{skill.fixedHurt}}<span v-if="skill.extFixedHurt">+{{skill.extFixedHurt}}</span></div>
  <div v-if="skill.critsRate">暴击几率：{{formatPercent(skill.critsRate)}}<span v-if="skill.extCritsRate">+{{formatPercent(skill.extCritsRate)}}</span></div>
  <div v-if="skill.critsDamageRate">暴击伤害：{{formatPercent(skill.critsDamageRate)}}<span v-if="skill.extCritsDamageRate">+{{formatPercent(skill.extCritsDamageRate)}}</span></div>
  <div v-if="skill.atkUp">物攻加成：{{formatPercent(skill.atkUp)}}<span v-if="skill.extAtkUp">+{{formatPercent(skill.extAtkUp)}}</span></div>
  <div v-if="skill.magicUp">法攻加成：{{formatPercent(skill.magicUp)}}<span v-if="skill.extMagicUp">+{{formatPercent(skill.extMagicUp)}}</span></div>
  <div v-if="skill.defUp">防御倍率：{{formatPercent(skill.defUp)}}</div>
  <div v-if="skill.agiUp">速度倍率：{{formatPercent(skill.agiUp)}}</div>
  <div v-if="skill.attackMp">伤害削减MP：{{formatPercent(skill.attackMp)}}</div>
  <div v-if="skill.hit">命中率：{{formatPercent(skill.hit)}}<span v-if="skill.extHit">+{{formatPercent(skill.extHit)}}</span></div>
</template>
<script>
import { formatPercent } from '@/util/tools'
export default {
  props: {
    skill: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return { formatPercent }
  }
}
</script>
<style scoped lang="less">

</style>
