<template>
  <a-card :title="name" class="pocket" size="small">
    <template #extra>
      <a-select v-model:value="pocket_type" style="width: 120px" size="small">
        <a-select-option :value="item.value" v-for="(item, index) in pocket_type_list" :key="index">
          {{item.value}}
        </a-select-option>
      </a-select>
      <span class="action_style">分解</span>
      <span class="action_style">出售</span>
    </template>
    <a-card-grid :hoverable="false" v-for="(item, index) in content" :key="index" class="pocket_item">
      {{ item.name+index}}
    </a-card-grid>
  </a-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
const name = ref('背包')
const content = reactive([
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  },
  {
    name: 'content'
  }
])
const pocket_type = ref('全部')
const pocket_type_list = reactive([
  {
    value: '消耗品'
  },
  {
    value: '材料'
  }
])
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
