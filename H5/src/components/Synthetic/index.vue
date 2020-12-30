<template>
  <a-card :title="name" class="synthetic" size="small">
    <a-card-grid v-for="(item, index) in composeList" :key="index" class="synthetic_item">
      <span :style="{ color: qualityMap[item.quality].color }">
        {{item.name}}
      </span>
      <div>合成材料：{{item.meterials}}</div>
      <a-button type="primary" size="small" @click="() => handleCompose(item._id)">
        合成
      </a-button>
    </a-card-grid>
  </a-card>
</template>

<script>
import GoodsData from '@/data/goods.json'
import { reactive, ref, onMounted, defineComponent } from 'vue'
import { qualityMap } from '@/util/enum'
import { composeProp } from '@/api/player'
import { message } from 'ant-design-vue'
export default defineComponent({
  setup() {
    const name = ref('合成道具')

    // 可合成的物品
    const canComposeList = GoodsData.filter(gd => gd.compose && gd.compose.length > 0)

    // 显示可合成
    const composeList = []
    canComposeList.map(ccl => {
      const meterials = []
      ccl.compose.map(cclc => {
        const [goodsId, count] = cclc
        const gds = GoodsData.find(gd => gd._id === goodsId)
        meterials.push(`${gds.name}x${count}`)
      })
      composeList.push({
        _id: ccl._id,
        name: ccl.name,
        quality: ccl.quality,
        meterials: meterials.join('，')
      })
    })

    const handleCompose = async (_id) => {
      try {
        await composeProp(_id)
        message.success('合成成功')
      } catch(e) {
        console.error(e)
      }
    }

    return {
      qualityMap,
      name,
      composeList,
      handleCompose
    }
  }
})
</script>
<style lang="less" scoped>
.synthetic /deep/ .ant-card-body{
  overflow-y: scroll!important;
  height: calc(100% - 38px)!important;
  margin-right: -10px;
}
.synthetic {
  height: 100%;
  width: 100%;
  &_item {
    width: 20%;
    text-align: center;
    padding: 8px;
  }
}
</style>
