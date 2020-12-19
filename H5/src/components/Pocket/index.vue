<template>
  <a-card :title="name" class="pocket" size="small">
    <template #extra>
      <a @click="handleGetProps" class="action_style">刷新</a>
    </template>
    <a-card-grid :hoverable="false" v-for="(item, index) in content.arr" :key="index" class="pocket_item">
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
    </a-card-grid>
  </a-card>
</template>
<script setup>
// TODO 线上显示不出来不知道为啥
import GoodsData from '@/data/Goods.json'
import { reactive, ref, onMounted } from 'vue'
import { getProp } from '@/api/player'
const name = ref('背包')
const content = reactive({
  arr: [],
  total: 0
})
const qualityMap = {
  0: { color: 'rgba(0, 0, 0, 0.65)', name: '普通' },
  1: { color: '#3650D4', name: '稀有' },
  2: { color: '#6437D5', name: '神话' },
  3: { color: '#A522A3', name: '传说' },
  4: { color: '#C38026', name: '不朽' },
  5: { color: '#7BB148', name: '至宝' }
}
const handleGetProps = async() => {
  const { data } = await getProp(1)
  content.arr = data.list.map(l => {
    const g = GoodsData.find(g => l.goodsId === g._id)
    return {
      id: l._id,
      count: l.count,
      name: g.name,
      mark: g.mark,
      lv: g.lv,
      type: g.type,
      quality: g.quality
    }
  })
  content.total = data.total
}

onMounted(() => {
  handleGetProps()
})

</script>

<style lang="less" scoped>
.pocket /deep/ .ant-card-body{
  overflow-y: scroll!important;
  height: calc(100% - 38px)!important;
  margin-right: -10px;
}
/deep/ .ant-card-grid{
  padding: 10px;
  width: 12.5%;
  text-align: center;
}
.pocket_item{
  overflow: hidden;
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
