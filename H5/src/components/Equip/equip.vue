<template>
  <a-spin tip="请等待......" :spinning="equipLoading">
    <a-card class="equip" size="small" title="装备">
      <Shown
        v-for="type in showOrder"
        :key="type"
        :p="type"
        :equip="getEquipByType(equip, type)"
      >
        <a-button type="danger" size="small" @click="() => handleDressEquip(getEquipByType(equip, type).id)">
          卸下
        </a-button>
      </Shown>
    </a-card>
  </a-spin>
</template>

<script>
import { defineComponent } from 'vue'
import Shown from './shown'
import { getEquip, dressEquip, sellEquip } from '@/api/player'
// import { sleep } from '@/util/tools'
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
.equip_list{
  width: 50%;
  height: calc(100vh - 100px);
  overflow-y: scroll;
}
</style>
