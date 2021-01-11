<template>
  <a-card title="市场" class="market" size="small">
    <template #extra>
      <a-select
        v-model:value="itemType"
        style="width: 120px"
        size="small"
      >
        <a-select-option value="prop">道具</a-select-option>
        <a-select-option value="pet">宠物</a-select-option>
        <a-select-option value="equip">装备</a-select-option>
      </a-select>
      <a-select
        v-if="itemType === 'equip'"
        v-model:value="equipType"
        style="width: 120px"
        size="small"
      >
        <a-select-option v-for="qo in weaponOptions" :key="qo.value" :value="qo.value">
          {{qo.label}}
        </a-select-option>
      </a-select>
      <span style="width:15px;display:inline-block"></span>
      <a-button @click="handleGetItemList" type="primary" size="small">搜索</a-button>
    </template>
    <a-spin tip="购买中......" :spinning="loading">
      <a-card-grid v-for="(item, index) in arr.itemList" :key="index" class="market_item">
        <wapon v-if="item.equip" :equip="item.equip" />
        <pet v-if="item.pet" :pet="item.pet" />
        <prop v-if="item.prop" :prop="item.prop" />
        <div>售价：{{item.gold}}</div>
        <div>
          卖家：{{item.seller}}
          <a-button v-if="item.seller === self" size="small" @click="() => handleStopSellEquip(item._id)">
            下架
          </a-button>
          <a-button v-else type="primary" size="small" @click="() => handleBuyEquip(item._id)">
            购买
          </a-button>
        </div>
      </a-card-grid>
    </a-spin>
  </a-card>
</template>

<script>
import { reactive, ref, defineComponent, onMounted } from 'vue'
import { getAllItem, buyItem, stopSell } from '@/api/market'
import { message } from 'ant-design-vue'
import wapon from '@/components/Equip/shown.vue'
import pet from '@/components/Pet/info.vue'
import prop from '@/components/Pocket/prop.vue'
import GoodsData from '@/data/goods.json'
import { useStore } from 'vuex'
import { weaponOptions } from '@/util/enum'
export default defineComponent({
  components: { wapon, pet, prop },
  setup() {
    const store = useStore()
    const loading = ref(false)
    const arr = reactive({
      itemList: []
    })
    onMounted(() => {
      message.info('首次进来请去右上角选择查询条件进行搜索')
    })

    const itemType = ref('prop')
    const equipType = ref('5')
    const handleGetItemList = async() => {
      const { data } = await getAllItem({ searchType: itemType.value, equipType: Number(equipType.value) })
      if (itemType.value === 'prop') {
        data.map(d => {
          d.prop = GoodsData.find(g => g._id === d.prop)
          d.prop.count = d.propCount
          return d
        })
      }
      arr.itemList = data
      if (data.length === 0) {
        message.info('无数据，去右上角切换查询条件后再搜索')
      }
    }
    const handleBuyEquip = async(id) => {
      loading.value = true
      try {
        await buyItem(id)
        const i = arr.itemList.findIndex(el => el.id === id)
        arr.itemList.splice(i, 1)
        message.success('购买成功')
      } catch (e) {
        console.error(e)
      }
      loading.value = false
    }
    const handleStopSellEquip = async(id) => {
      loading.value = true
      try {
        await stopSell(id)
        const i = arr.itemList.findIndex(el => el.id === id)
        arr.itemList.splice(i, 1)
        message.success('下架成功')
      } catch (e) {
        console.error(e)
      }
      loading.value = false
    }
    return {
      self: store.state.user.username,
      loading,
      arr,
      itemType,
      equipType,
      handleGetItemList,
      handleBuyEquip,
      handleStopSellEquip,
      weaponOptions
    }
  }
})

</script>

<style lang="less" scoped>
.market /deep/ .ant-card-body{
  overflow-y: scroll!important;
  height: calc(100% - 38px)!important;
  margin-right: -10px;
}
/deep/ .ant-card-grid{
  padding: 0 10px;
  width: 25%;
}
.market{
  height: 100%;
  width: 100%;
  .action_style{
    display: inline-block;
    margin: 0 5px;
    cursor: pointer;
  }
  .eq_item{
    padding: 8px;
  }
}
</style>
