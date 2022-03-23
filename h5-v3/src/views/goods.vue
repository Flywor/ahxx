<template>
  <div class="equip">
    <a-button type="primary" size="small" @click="handleGetGoods">刷新道具</a-button>
    <a-list item-layout="vertical" :data-source="goodsList">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a :style="{ color: qualityColorMap[item.quality] }">
                {{ item.name }} x {{item.count}}
              </a>
            </template>
            <template #description>
              {{item.mark}}
            </template>
          </a-list-item-meta>
          <template #actions>
            <a @click="() => handleSell(item)">卖出</a>
            <a v-if="item.type == 0" @click="() => handleUse(item)">使用</a>
            <a v-if="item.type == 0" @click="() => handleAllUse(item)">全部使用</a>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import request from '@/util/request'
import { store } from '@/store'
import { Modal } from 'ant-design-vue'
const goodsList = computed(() => store.state.goodsList)
const handleUse = (item: any) => {
  request({
    url: '/goods',
    method: 'post',
    data: { id: item.id }
  })
}
const handleAllUse = (item: any) => {
  Modal.confirm({
    title: '防手残确认框',
    content: '本当にこれを売るの?',
    onOk() {
      request({
        url: '/allgoods',
        method: 'post',
        data: { id: item.id }
      })
    }
  })
}
const handleGetGoods = (item: any) => {
  request({
    url: '/getGoods',
    method: 'get'
  })
}
const handleSell = (item: any) => {
  Modal.confirm({
    title: '防手残确认框',
    content: '本当にこれを売るの?',
    onOk() {
      request({
        url: '/sell',
        method: 'post',
        data: { goodsId: item.id }
      })
    }
  })
}
const qualityColorMap = {
  1: 'rgba(0, 0, 0, 0.65)',
  2: '#0779e4',
  3: '#ff7e67',
  4: 'red'
}
</script>