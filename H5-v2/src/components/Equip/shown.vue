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
              {{a.key}} + {{a.value}}
            </div>
            <div v-for="a in affixList" :key="a.key" :style="{ color: 'blue' }" class="info_style">
              {{a.key}} + {{a.value}}
            </div>
            <div v-if="equip.treasure" class="info_style" style="color:red;">{{getMarkByAffixValue(equip.treasure)}}</div>
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
      <div class="shown-container-opera" v-if="equip">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
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
      typeMap
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
          value: attr[key]
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
          value: val < 1 ? `${Math.round(val * 100)}%` : val
        })
      })
      return result
    }
  },
  methods: {
    getMarkByAffixValue(affixValue) {
      return (AffixData.find(aff => aff.value === affixValue) || '这是个bug').mark
    }
  }
}
</script>
<style lang="less" scoped>
.shown {
  height: 32px;
  cursor: pointer;
  &-container {
    display: flex;
    align-items: center;
    overflow: hidden;
    line-height: 32px;
    &-left {
      flex: 1;
      overflow: hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
    }
    &-opera {
      transition: transform .3s;
      transform: translateX(101%)
    }
  }
  &:hover {
    .shown-container-opera {
      transform: translateX(0)
    }
  }
}
.info_style{
  padding-left: 8px;
}
</style>
