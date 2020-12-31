<template>
  <a-card :title="name" class="pocket" size="small">
    <template #extra>
      <a @click="handleGetProps" class="action_style">刷新</a>
    </template>
    <a-card-grid :hoverable="false" v-for="(item, index) in content.arr" :key="index" class="pocket_item">
      <div class="left">
        <a-popover>
          <template #title>
            <h3 :style="{ color: qualityMap[item.quality].color }">
              {{item.name}}
            </h3>
          </template>
          <template #content>
            <div style="padding-left: 8px;">
              {{item.mark}}
            </div>
          </template>
          <span :style="{ color: qualityMap[item.quality].color }">{{item.name}}</span>x{{item.count}}
        </a-popover>
      </div>
      <div class="right" v-if="item.type === 0">
        <a-button type="primary" size="small" @click="() => handleUseProp(item)">
          使用
        </a-button>
      </div>
    </a-card-grid>
  </a-card>
</template>
<script>
import GoodsData from '@/data/Goods.json'
import { reactive, ref, onMounted, defineComponent } from 'vue'
import { getProp, useProp } from '@/api/player'
import { qualityMap } from '@/util/enum'
import { message } from 'ant-design-vue'

export default defineComponent({
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
    return {
      name,
      content,
      qualityMap,
      handleUseProp,
      handleGetProps
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
