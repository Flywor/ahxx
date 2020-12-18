<template>
  <a-spin tip="请等待......" :spinning="equipLoading">
    <a-card class="equip" size="small" title="装备">
      <Shown
        v-for="type in showOrder"
        :key="type"
        :p="type"
        :equip="getEquipByType(equip, type)"
      >
        <a-button type="danger" size="small" @click="() => handleDressEquip(getEquipByType(equip, type)._id)">
          卸下
        </a-button>
      </Shown>
      <a-card class="equip" size="small" title="兵装库">
        <template #extra>
          <a
            @click="handleGetEquip"
          >刷新</a>
        </template>
        <Shown
          v-for="(equip, i) in equipList"
          :key="i"
          :equip="equip"
        >
          <a-button type="primary" size="small" @click="() => handleDressEquip(equip._id)">
            穿
          </a-button>
          <a-button type="danger" size="small" @click="() => handleSellEquip(equip._id)">
            丢
          </a-button>
        </Shown>
        <p v-if="geted && total === 0">没装备，去挂机--吧</p>
        <p v-if="!geted">刷新获取装备</p>
        <a-pagination simple hideOnSinglePage v-model:current="page" :total="total" @change="handleGetEquip"/>
      </a-card>
    </a-card>
  </a-spin>
</template>

<script>
import { defineComponent } from 'vue'
import Shown from './shown'
import { getEquip, dressEquip, sellEquip } from '@/api/player'
import { sleep } from '@/util/tools'
export default defineComponent({
  components: { Shown },
  data() {
    return {
      showOrder: [5, 0, 3, 1, 4, 2, 6, 7],
      equipLoading: false,
      geted: false,
      page: 1,
      total: 0,
      equipList: []
    }
  },
  computed: {
    equip() {
      return this.$store.state.equip
    }
  },
  methods: {
    getEquipByType(equip, type) {
      return equip.find(e => e.type === type)
    },
    async handleGetEquip() {
      const { data } = await getEquip(this.page)
      this.geted = true
      this.equipList = data.list
      this.total = data.total
    },
    async handleDressEquip(id) {
      await dressEquip(id)
      this.handleGetEquip()
    },
    async handleSellEquip(id) {
      await sellEquip(id)
      this.handleGetEquip()
    }
  }
})
</script>

<style lang="less" scoped>
.equip{
  width: 100%;
}
</style>
