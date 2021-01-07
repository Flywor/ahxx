<template>
  <a-card :title="name" class="shop" size="small">
    <a-card-grid v-for="(item, index) in sellGoods" :key="index" class="shop_item">
      <strong :style="{ color: qualityMap[item.quality].color }">【{{item.name}}】</strong>
      <div>售价：{{item.gold}}</div>
      <a-button type="primary" size="small" @click="() => handleBuy(item._id)">
        购买
      </a-button>
    </a-card-grid>
  </a-card>
</template>

<script>
import ShopData from '@/data/shop.json'
import GoodsData from '@/data/goods.json'
import { ref, defineComponent } from 'vue'
import { buyItem } from '@/api/player'
import { message } from 'ant-design-vue'
import { qualityMap } from '@/util/enum'
export default defineComponent({
  setup() {
    const name = ref('商店')
    const systemShop = ShopData[0]
    const sellGoods = systemShop.sellGoods.map(goods => {
      const [goodsId, gold] = goods
      const gds = GoodsData.find(gd => gd._id === goodsId)
      return {
        _id: goodsId,
        name: gds.name,
        quality: gds.quality,
        gold
      }
    })

    const handleBuy = async(_id) => {
      try {
        await buyItem(systemShop._id, _id)
        message.success('购买成功！')
      } catch (e) {
        console.error(e)
      }
    }

    return {
      name,
      sellGoods,
      handleBuy,
      qualityMap
    }
  }
})
</script>
<style lang="less" scoped>
.shop /deep/ .ant-card-body{
  overflow-y: scroll!important;
  height: calc(100% - 38px)!important;
  margin-right: -10px;
}
.shop {
  height: 100%;
  width: 100%;
  &_item {
    width: 20%;
    text-align: center;
    padding: 8px;
  }
}
</style>
