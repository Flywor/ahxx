<template>
  <div class="shown">
    <div class="shown-container">
      <div class="shown-container-left">
        <a-popover v-if="equip">
          <template #title>
            <h3 :style="{ color: qualityMap[equip.quality].color }">
              {{equip.name}}
            </h3>
          </template>
          <template #content>
            <div class="info_style">
              {{qualityMap[equip.quality].name}}{{typeMap[equip.type]}}
            </div>
            <div v-for="a in attrList" :key="a.key" class="info_style">
              <span>{{a.key}} + {{a.value}}</span>({{a.min}} - {{a.max}})
            </div>
            <div v-for="a in affixList" :key="a.key" :style="{ color: 'blue' }" class="info_style">
              <span>{{a.key}} + {{a.value}}</span>({{a.min}} - {{a.max}})
            </div>
            <div v-if="equip.treasure" class="info_style" style="color:red;">{{getMarkByAffixValue(equip.treasure)}}</div>
            <div class="shown-container-opera" v-if="equip">
              <slot></slot>
            </div>
          </template>
          <label v-show="p > -1">{{typeMap[p]}}：</label>
          <span :style="{ color: qualityMap[equip.quality].color, flex: 1 }">
            <template v-if="p === undefined">[{{typeMap[equip.type]}}]</template> {{showTitle}}
          </span>
        </a-popover>
        <template v-else>
          <label v-show="p > -1">{{typeMap[p]}}：</label>
          <span></span>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import EquipData from '@/data/equip.json'
import AffixData from '@/data/affix.json'
import { qualityMap, typeMap } from '@/util/enum'
export default {
  props: {
    p: {
      type: Number
    },
    equip: {
      type: Object
    }
  },
  data() {
    return {
      qualityMap,
      typeMap,
      minRate: 0.8, // 装备roll属性下限
      maxRate: 1.7 // 装备roll属性下限
    }
  },
  computed: {
    showTitle() {
      const equip = this.equip
      if (equip.name) {
        return `Lv.${equip.lv} ${equip.name || ''}`
      } else {
        return null
      }
    },
    configEquipData() {
      if (this.equip.equipId) {
        return EquipData.find(ed => ed._id === this.equip.equipId)
      } else {
        return {}
      }
    },
    attrList() {
      const result = []
      const attrMap = {
        'hp': 'HP',
        'mp': 'MP',
        'atk': '物攻',
        'magic': '法攻',
        'def': '物防',
        'speed': '速度'
      }
      const attr = this.equip.attr || {}
      Object.keys(attr).map(key => {
        result.push({
          key: attrMap[key],
          value: attr[key],
          ...this.getAttrMinMax(key)
        })
      })
      return result
    },
    affixList() {
      const result = []
      const affix = this.equip.affix || {}
      Object.keys(affix).map(key => {
        const val = Number(affix[key])
        result.push({
          key: this.getMarkByAffixValue(key),
          value: val < 1 ? `${Math.round(val * 100)}%` : val,
          ...this.getAffixMinMax(key)
        })
      })
      return result
    }
  },
  methods: {
    getMarkByAffixValue(affixValue) {
      return (AffixData.find(aff => aff.value === affixValue) || {}).mark || '特殊词缀已更换'
    },
    getAttrMinMax(attrKey) {
      const { attr } = this.configEquipData
      if(!attr) return {}
      try {
        const value = attr.find(a => a[0] === attrKey)[1]
        return this.getMinMax(value)
      } catch(e) {
        console.warn('获取属性信息错误', this.equip)
        return {}
      }
    },
    getAffixMinMax(affixKey) {
      const { affix } = this.configEquipData
      if(!affix) return {}
      try {
        const value = affix.find(a => a[0] === affixKey)[1]
        return this.getMinMax(value)
      } catch(e) {
        console.warn('获取词缀信息错误', this.equip)
        return {}
      }
    },
    getMinMax(value) {
      let min = 0
      let max = 0
      if (value < 1) {
        min = `${Math.round(this.minRate * value * Math.sqrt(this.equip.lv / 5) * 100)}%`
        max = `${Math.round(this.maxRate * value * Math.sqrt(this.equip.lv / 5) * 100)}%`
      } else {
        min = Math.round(this.minRate * value * (this.equip.lv * 0.3))
        max = Math.round(this.maxRate * value * (this.equip.lv * 0.3))
      }
      return { min, max }
    }
  }
}
</script>
<style lang="less" scoped>
.shown {
  height: 32px;
  cursor: pointer;
  &-container {
    position: relative;
    line-height: 32px;
    &-left {
      flex: 1;
      overflow: hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
    }
    &-opera {
      margin-top: 16px;
    }
  }
}
.info_style{
  padding-left: 8px;
  display: flex;
  span {
    flex: 1;
  }
}
</style>
