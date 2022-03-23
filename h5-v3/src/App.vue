<template>
  <router-view />
  <a-modal
    v-model:visible="state.showShop"
    :title="state.shopName"
    centered
    @ok="handleBuy"
    okText="购买"
    cancelText="没钱"
    :okButtonProps="{ disabled: (buyGoldCount == 0 && buyCoinCount == 0) }"
  >
    <a-list item-layout="horizontal" :data-source="state.goods">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a :style="{ color: qualityColorMap[item.quality] }">
                {{ item.name }}
              </a>
            </template>
            <template #description>
              {{item.mark}}
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-input-number style="width: 60px;" v-model:value="item.count" :min="0" />
            x
          <p v-if="item.sellGold">{{item.sellGold}}金币</p>
          <p v-if="item.sellCoin">{{item.sellCoin}}灵石</p>
          </template>
        </a-list-item>
      </template>
    </a-list>
    <p style="text-align: right;margin:0;" :style="{ opacity: (buyGoldCount > 0 || buyCoinCount > 0) ? 1: 0 }">
      合计：
      <label v-if="buyGoldCount > 0">
        {{buyGoldCount}}金币&nbsp;
      </label>
      <label v-if="buyCoinCount > 0">
        {{buyCoinCount}}灵石&nbsp;
      </label>
    </p>
  </a-modal>
</template>
<script setup lang="ts">
import { reactive, computed } from 'vue'
import request from '@/util/request'
const state = reactive({
  showShop: false,
  shopNpc: '',
  shopId: '',
  shopName: '',
  goods: []
})

const buyGoldCount = computed(() => {
  let count = 0
  state.goods.filter((g: any) => !!g.sellGold && g.count > 0).map((g: any) => {
    count += (g.sellGold * g.count)
  })
  return count
})
const buyCoinCount = computed(() => {
  let count = 0
  state.goods.filter((g: any) => !!g.sellCoin && g.count > 0).map((g: any) => {
    count += (g.sellCoin * g.count)
  })
  return count
})

const qualityColorMap = {
  1: 'rgba(0, 0, 0, 0.65)',
  2: '#0779e4',
  3: '#9d0191',
  4: '#ff7e67'
}
window.showShop = (shop: any) => {
  const { npc, shopId, name, goods } = shop
  goods.map((g: any) => g.count = 0)
  state.shopNpc = npc
  state.shopId = shopId
  state.shopName = name
  state.goods = goods
  state.showShop = true
}

const handleBuy = () => {
  let buyItems: any[] = []
  state.goods.filter((g: any) => g.count > 0).map((g: any) => {
    buyItems.push({
      goodsId: g.goodsId,
      count: g.count
    })
  })
  request({
    url: '/buy',
    method: 'post',
    data: { npc: state.shopNpc, shopId: state.shopId, buyItems }
  }).then(() => state.showShop = false)
  
}
</script>