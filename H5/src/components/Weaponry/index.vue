<template>
  <a-card :title="name" class="eq" size="small">
    <template #extra>
      <span class="action_style">排序</span>
      <span @click="handleGetEquip" class="action_style">刷新</span>
    </template>
    <a-card-grid v-for="(item, index) in arr.equipList" :key="index" class="eq_item">
      <wapon :equip="item" >
        <a-button type="primary" size="small" @click="() => handleDressEquip(item._id)">
          穿
        </a-button>
        <a-button type="danger" size="small" @click="() => handleSellEquip(item._id)">
          弃
        </a-button>
      </wapon>
    </a-card-grid>
    <!-- <p v-if="geted && total === 0">没装备，去挂机--吧</p>
    <p v-else>刷新获取装备</p> -->
  </a-card>
</template>

<script>
import { reactive, ref, defineComponent, onMounted } from 'vue'
import { getEquip, dressEquip, sellEquip } from '@/api/player'
import wapon from '@/components/Equip/shown.vue'

export default defineComponent({
  components: {
    wapon
  },
  setup() {
    const name = ref('兵装')
    // const geted = ref(false)
    const arr = reactive({
      equipList: []
    })
    onMounted(() => {
      handleGetEquip()
    })
    const page = ref(1)
    const total = ref(0)
    const handleGetEquip = async() => {
      const { data } = await getEquip(page.value)
      // geted.value = true
      arr.equipList = data.list
      console.log(data.list)
      total.value = data.total
    }
    const handleDressEquip = async(id) => {
      await dressEquip(id)
      handleGetEquip()
    }
    const handleSellEquip = async(id) => {
      await sellEquip(id)
      handleGetEquip()
    }
    return {
      name,
      // geted,
      arr,
      page,
      total,
      handleGetEquip,
      handleDressEquip,
      handleSellEquip
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
