<template>
  <a-card title="装备市场" class="market" size="small">
    <template #extra>
      <a-select
        v-model:value="screen"
        style="width: 120px"
        size="small"
        :allowClear='true'
      >
        <a-select-option v-for="qo in typeMap" :key="qo.type" :value="qo.type">
          {{qo.name}}
        </a-select-option>
      </a-select>
      <a-button @click="handleScreen" type="primary" size="small">确认部位筛选</a-button>
      <span style="width:15px;display:inline-block"></span>
      <a @click="handleGetEquip" class="action_style">刷新</a>
    </template>
    <a-spin tip="购买中......" :spinning="loading">
      <a-card-grid v-for="(item, index) in arr.equipList" :key="index" class="market_item">
        <wapon :equip="item.equip" />
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
import { useStore } from 'vuex'
const qualityOptions = [
  { value: 0, label: '普通' },
  { value: 1, label: '稀有' },
  { value: 2, label: '神话' },
  { value: 3, label: '传说' },
  { value: 4, label: '不朽' },
  { value: 5, label: '至宝' }
]
const typeMap = [
  {
    type: 0,
    name: '头盔'
  },
  {
    type: 1,
    name: '手套'
  },
  {
    type: 2,
    name: '鞋子'
  },
  {
    type: 3,
    name: '胸甲'
  },
  {
    type: 4,
    name: '腰带'
  },
  {
    type: 5,
    name: '武器'
  },
  {
    type: 6,
    name: '戒指'
  },
  {
    type: 7,
    name: '项链'
  }
]
export default defineComponent({
  components: { wapon },
  setup() {
    let tempData = null
    const store = useStore()
    const loading = ref(false)
    const arr = reactive({
      equipList: []
    })
    onMounted(async() => {
      await handleGetEquip()
      arr.equipList = tempData
    })
    const handleGetEquip = async() => {
      const { data } = await getAllItem()
      tempData = data
      handleScreen()
    }
    const handleBuyEquip = async(id) => {
      loading.value = true
      try {
        await buyItem(id)
        const i = arr.equipList.findIndex(el => el.id === id)
        arr.equipList.splice(i, 1)
      } catch(e) {
        console.error(e)
      }
      loading.value = false
    }
    const handleStopSellEquip = async(id) => {
      loading.value = true
      try {
        await stopSell(id)
        message.success('下架成功')
      } catch(e) {
        console.error(e)
      }
      loading.value = false
    }
    // 背包筛选
    const screen = ref('')
    const handleScreen = () => {
      if (!screen.value && screen.value !== 0) {
        arr.equipList = tempData
        return
      }
      arr.equipList = tempData.filter(el => el.equip.type === screen.value)
    }
    return {
      self: store.state.user.username,
      loading,
      arr,
      handleGetEquip,
      handleBuyEquip,
      handleStopSellEquip,
      qualityOptions,
      typeMap,
      screen,
      handleScreen
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
