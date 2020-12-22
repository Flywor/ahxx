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
            <div v-for="a in affixList" :key="a.key" :style="{ color: qualityMap[equip.quality].color }" class="info_style">
              {{a.key}} + {{a.value}}
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
      <div class="shown-container-opera" v-if="equip">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import AffixData from '@/data/Affix.json'
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
      typeMap: {
        0: '头盔',
        1: '手套',
        2: '鞋子',
        3: '胸甲',
        4: '腰带',
        5: '武器',
        6: '戒指',
        7: '项链'
      },
      qualityMap: {
        0: { color: 'rgba(0, 0, 0, 0.65)', name: '普通' },
        1: { color: '#0779e4', name: '稀有' },
        2: { color: '#9d0191', name: '神话' },
        3: { color: '#ff7e67', name: '传说' },
        4: { color: '#f1c550', name: '不朽' },
        5: { color: '#fa1616', name: '至宝' }
      }
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
        'hp': '血量',
        'atk': '攻击',
        'def': '防御',
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
        const a = AffixData.find(aff => aff.value === key)
        result.push({
          key: a.mark,
          value: val < 1 ? `${Math.round(val * 100)}%` : val
        })
      })
      return result
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
