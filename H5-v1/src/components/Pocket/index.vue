<template>
  <a-card :title="name" class="pocket" size="small">
    <template #extra>
      <a @click="handleGetProps" class="action_style">刷新</a>
    </template>
    <a-card-grid :hoverable="false" v-for="(item, index) in content.arr" :key="index" class="pocket_item">
      <div class="left">
        <Prop :prop="item" />
      </div>
      <div class="right">
        <a-button v-if="item.type === 0" type="primary" size="small" @click="() => handleUseProp(item)">
          使用
        </a-button>
        <a-button size="small" @click="() => handleSellMarketProp(item)">
          上架
        </a-button>
      </div>
    </a-card-grid>
    <a-modal
      v-model:visible="sellMarketVisible"
      title="输入售价（出售成功收取10%手续费）"
      centered
      @ok="commitSellMarket"
      :confirmLoading="sellMarketLoading"
    >
      <Prop :prop="sellMarketProp.prop" />
      <div>
        <span>数量：</span>
        <a-input-number style="width: 160px;" v-model:value="sellMarketCount" :min="1" />
      </div>
      <div>
        <span>售价：</span>
        <a-input-number style="width: 160px;" v-model:value="sellMarketGold" :min="1" />
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import GoodsData from '@/data/goods.json'
import { reactive, ref, onMounted, defineComponent } from 'vue'
import { getProp, useProp } from '@/api/player'
import { message } from 'ant-design-vue'
import { marketSellProp } from '@/api/market'
import Prop from './prop'
export default defineComponent({
  components: { Prop },
  setup() {
    const name = ref('背包')
    const content = reactive({
      arr: [],
      total: 0
    })
    const handleGetProps = async() => {
      const { data } = await getProp(1)
      content.arr = data.list.map(l => {
        const g = GoodsData.find(g => l.goodsId === g._id)
        return {
          id: l.id,
          count: l.count,
          name: g.name,
          mark: g.mark,
          lv: g.lv,
          type: g.type,
          quality: g.quality,
          attr: JSON.parse(g.attr)
        }
      })
      content.total = data.total
    }
    const handleUseProp = async(item) => {
      await useProp(item.id)
      message.success('使用成功')
      handleGetProps()
    }

    onMounted(() => {
      handleGetProps()
    })

    const sellMarketVisible = ref(false)
    const sellMarketCount = ref(1)
    const sellMarketGold = ref(1)
    const sellMarketProp = reactive({
      prop: null
    })
    const sellMarketLoading = ref(false)
    const handleSellMarketProp = (item) => {
      sellMarketProp.prop = item
      sellMarketGold.value = 1
      sellMarketVisible.value = true
    }
    const commitSellMarket = async() => {
      if (sellMarketGold.value <= 0) {
        message.error('售价不对劲')
        return
      }
      if (sellMarketCount.value <= 0) {
        message.error('数量不对劲')
        return
      }
      sellMarketLoading.value = true
      try {
        await marketSellProp(sellMarketProp.prop.id, sellMarketCount.value, sellMarketGold.value)
        handleGetProps()
        message.success('上架成功')
      } catch (e) {
        console.error(e)
      }
      sellMarketLoading.value = false
      sellMarketVisible.value = false
    }

    return {
      name,
      content,
      handleUseProp,
      handleGetProps,
      sellMarketVisible,
      sellMarketCount,
      sellMarketGold,
      sellMarketProp,
      handleSellMarketProp,
      sellMarketLoading,
      commitSellMarket
    }
  }
})

</script>

<style lang="less" scoped>
.pocket /deep/ .ant-card-body{
  overflow-y: scroll!important;
  height: calc(100% - 38px)!important;
  margin-right: -10px;
}
/deep/ .ant-card-grid{
  padding: 8px;
  width: 25%;
  display: flex;
  align-items: center;
  height: 38px;
  .left {
    flex: 1;
  }
  .right {
    transition: transform .3s;
    transform: translateX(150%)
  }
  &:hover {
    .right {
      transform: translateX(0)
    }
  }
}
.pocket_item{
  overflow: hidden;
  cursor: pointer;
}
.pocket{
  height: 100%;
  width: 100%;
  .action_style{
    display: inline-block;
    margin: 0 5px;
  }
}

</style>
