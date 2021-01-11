<template>
  <a-card :title="name" class="eq" size="small">
    <template #extra>
      <a-select
        v-model:value="screen"
        style="width: 120px"
        size="small"
        :allowClear='true'
      >
        <a-select-option v-for="qo in weaponOptions" :key="qo.value" :value="qo.value">
          {{qo.label}}
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
          穿戴
        </a-button>
        <a-button type="danger" size="small" @click="() => handleSellEquip(item.id)">
          分解
        </a-button>
        <a-button type="primary" size="small" @click="() => handleSellMarketEquip(item)">
          上架
        </a-button>
        <a-popconfirm
          title="确认升品？需要消耗品质相应的石头"
          ok-text="嗯"
          cancel-text="不"
          @confirm="() => handleEquipQualityUp(item.id)"
        >
          <a-button type="primary" size="small">
            升品
          </a-button>
        </a-popconfirm>
        <a-popconfirm
          title="确认洗白？需要消耗重铸石"
          ok-text="嗯"
          cancel-text="不"
          @confirm="() => handleEquipReset(item.id)"
        >
          <a-button type="primary" size="small">
            洗白
          </a-button>
        </a-popconfirm>
      </wapon>
    </a-card-grid>
    <a-modal
      v-model:visible="sellMarketVisible"
      title="输入售价（出售成功收取10%手续费）"
      centered
      @ok="commitSellMarket"
      :confirmLoading="sellMarketLoading"
    >
      <wapon :equip="sellMarketEquip.equip">
      </wapon>
      <div>
        <span>售价：</span>
        <a-input-number style="width: 160px;" v-model:value="sellMarketGold" :min="1" />
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import { reactive, ref, defineComponent, onMounted } from 'vue'
import { getEquip, dressEquip, sellEquip, sellEquipByQuality, equipQualityUp, equipReset } from '@/api/player'
import { marketSellEquip } from '@/api/market'
import { message } from 'ant-design-vue'
import wapon from '@/components/Equip/shown.vue'
import { qualityOptions, weaponOptions } from '@/util/enum'
export default defineComponent({
  components: { wapon },
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
      name.value = `装备（${data.total}/100）`
    }
    const handleDressEquip = async(id) => {
      await dressEquip(id)
      handleGetEquip()
    }

    const sellMarketVisible = ref(false)
    const sellMarketGold = ref(1)
    const sellMarketEquip = reactive({
      equip: null
    })
    const sellMarketLoading = ref(false)
    const handleSellMarketEquip = (item) => {
      sellMarketEquip.equip = item
      sellMarketGold.value = 1
      sellMarketVisible.value = true
    }
    const commitSellMarket = async() => {
      if (sellMarketGold.value <= 0) {
        message.error('售价不对劲')
        return
      }
      sellMarketLoading.value = true
      await marketSellEquip(sellMarketEquip.equip.id, sellMarketGold.value)
      handleGetEquip()
      message.success('上架成功')
      sellMarketLoading.value = false
      sellMarketVisible.value = false
    }

    const handleSellEquip = async(id) => {
      const { data: { gold }} = await sellEquip(id)
      handleGetEquip()
      message.success(`分解完成，获得了${gold}金币`)
    }
    const handleSellEquipByQuality = async() => {
      const quality = Number(sellQuality.value)
      if (!arr.equipList.some(el => el.quality == quality)) {
        return
      }
      const { data: { gold }} = await sellEquipByQuality(quality)
      handleGetEquip()
      message.success(`分解完成，获得了${gold}金币`)
    }

    const handleEquipQualityUp = async(id) => {
      await equipQualityUp(id)
      handleGetEquip()
      message.success('升品成功')
    }
    const handleEquipReset = async(id) => {
      await equipReset(id)
      handleGetEquip()
      message.success('洗白成功')
    }

    // 背包筛选
    const screen = ref('')
    const handleScreen = () => {
      if (!screen.value && screen.value !== 0) {
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
      handleEquipQualityUp,
      handleEquipReset,
      sellQuality,
      qualityOptions,
      weaponOptions,
      screen,
      handleScreen,
      sellMarketVisible,
      sellMarketEquip,
      sellMarketGold,
      handleSellMarketEquip,
      commitSellMarket,
      sellMarketLoading
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
  width: 20%;
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
