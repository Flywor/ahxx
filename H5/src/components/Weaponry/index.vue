<template>
  <a-card :title="name" class="eq" size="small">
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
      <a-select
        v-model:value="sellQuality"
        style="width: 120px"
        size="small"
      >
        <a-select-option v-for="qo in qualityOptions" :key="qo.key" :value="qo.value">
          {{qo.label}}
        </a-select-option>
      </a-select>
      <a-button type="primary" size="small" @click="handleSellEquipByQuality">
        确定分解品质
      </a-button>
      <a @click="handleGetEquip" class="action_style">刷新</a>
    </template>
    <a-card-grid v-for="(item, index) in arr.equipList" :key="index" class="eq_item">
      <wapon :equip="item" >
        <a-button type="primary" size="small" @click="() => handleDressEquip(item.id)">
          穿
        </a-button>
        <a-button type="danger" size="small" @click="() => handleSellEquip(item.id)">
          售
        </a-button>
      </wapon>
    </a-card-grid>
  </a-card>
</template>

<script>
import { reactive, ref, defineComponent, onMounted } from 'vue'
import { getEquip, dressEquip, sellEquip, sellEquipByQuality } from '@/api/player'
import { message } from 'ant-design-vue'
import wapon from '@/components/Equip/shown.vue'
// import GoodsData from '@/data/Goods.json'
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
  components: {
    wapon
  },
  setup() {
    const name = ref('装备')
    const arr = reactive({
      equipList: []
    })
    onMounted(() => {
      handleGetEquip()
    })
    const sellQuality = ref(qualityOptions[0].value)
    const handleGetEquip = async() => {
      const { data } = await getEquip(1)
      arr.equipList = data.list
    }
    const handleDressEquip = async(id) => {
      await dressEquip(id)
      handleGetEquip()
    }
    const handleSellEquip = async(id) => {
      const { data: { gold, materialCount }} = await sellEquip(id)
      handleGetEquip()
      message.success(`分解完成，获得了${gold}金币，${materialCount}个相应品质的装备碎片`)
    }
    const handleSellEquipByQuality = async() => {
      if (!arr.equipList.some(el => el.quality === sellQuality.value)) {
        return
      }
      const { data: { gold, materialCount }} = await sellEquipByQuality(sellQuality.value)
      handleGetEquip()
      message.success(`分解完成，获得了${gold}金币，${materialCount}个相应品质的装备碎片`)
    }
    // 背包筛选
    const screen = ref('')
    const handleScreen = () => {
      if (!screen.value) {
        handleGetEquip()
        return
      }
      getEquip(1).then(res => {
        arr.equipList = res.data.list.filter(item => {
          return item.type === screen.value
        })
      })
    }
    return {
      name,
      arr,
      handleGetEquip,
      handleDressEquip,
      handleSellEquip,
      handleSellEquipByQuality,
      sellQuality,
      qualityOptions,
      typeMap,
      screen,
      handleScreen
    }
  }
})

</script>

<style lang="less" scoped>
.eq /deep/ .ant-card-body{
  overflow-y: scroll!important;
  height: calc(100% - 38px)!important;
  margin-right: -10px;
}
/deep/ .ant-card-grid{
  padding: 0 10px;
  width: 25%;
}
.eq{
  height: 100%;
  width: 100%;
  .action_style{
    display: inline-block;
    margin: 0 5px;
    cursor: pointer;
  }
  .eq_item{
    height: 32px;
  }
}
</style>
