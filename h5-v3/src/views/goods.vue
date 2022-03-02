<template>
  <div class="equip">
    <a-list item-layout="horizontal" :data-source="goodsList">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a :style="{ color: qualityColorMap[item.quality] }">
                Lv.{{item.lv}} {{ item.name }} x {{item.count}}
              </a>
            </template>
            <template #description>
              {{item.mark}}
            </template>
          </a-list-item-meta>
          <template #actions>
            <a v-if="item.type == 0" @click="() => handleUse(item)">使用</a>
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
const goodsList = computed(() => store.state.goodsList)
const handleUse = (item: any) => {
  request({
    url: '/goods',
    method: 'post',
    data: { id: item.id }
  })
}
const qualityColorMap = {
  1: 'rgba(0, 0, 0, 0.65)',
  2: '#0779e4',
  3: '#9d0191',
  4: '#ff7e67'
}
</script>