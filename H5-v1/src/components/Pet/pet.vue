<template>
  <a-card title="宠物" class="pet" size="small">
    <template #extra>
      <a @click="getPet">刷新</a>
    </template>
    <a-card-grid v-for="(item, index) in petList" :key="index" class="pet_item">
      <PetDetail :pet="item" />
      <div>
        <a-button type="primary" size="small" @click="() => handleSwitchPetStatus(item.id)">
          {{statusMap[item.status]}}
        </a-button>
        <a-button type="danger" size="small" @click="() => handleDiscardPet(item.id)">
          丢弃
        </a-button>
        <a-button size="small" @click="() => handleRebornPet(item.id)">
          洗宠
        </a-button>
        <a-button type="primary" size="small" @click="() => handlerSellPet(item)">
          上架
        </a-button>
      </div>
    </a-card-grid>
    <a-modal
      v-model:visible="sellPetVisible"
      title="输入售价（出售成功收取10%手续费）"
      centered
      @ok="commitSellMarket"
      :confirmLoading="sellMarketLoading"
    >
      <PetDetail :pet="sellMarketPet" />
      <div>
        <span>售价：</span>
        <a-input-number style="width: 160px;" v-model:value="sellMarketGold" :min="1" />
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import { getPetList, switchPetStatus, discardPet, rebornPet } from '@/api/pet'
import { marketSellPet } from '@/api/market'
import { formatPercent } from '@/util/tools'
import { message } from 'ant-design-vue'
import PetDetail from './info'
export default {
  components: { PetDetail },
  data() {
    return {
      statusMap: {
        0: '休息',
        1: '出战'
      },
      petList: [],
      formatPercent,
      sellPetVisible: false,
      sellMarketLoading: false,
      sellMarketPet: null,
      sellMarketGold: 1
    }
  },
  mounted() {
    this.getPet()
  },
  methods: {
    async getPet() {
      const { data } = await getPetList()
      this.petList = data
    },
    async handleSwitchPetStatus(petId) {
      await switchPetStatus(petId)
      this.getPet()
    },
    async handleDiscardPet(petId) {
      await discardPet(petId)
      this.getPet()
    },
    async handleRebornPet(petId) {
      await rebornPet(petId)
      this.getPet()
    },
    handlerSellPet(pet) {
      this.sellMarketPet = pet
      this.sellMarketGold = 1
      this.sellPetVisible = true
    },
    async commitSellMarket() {
      if (this.sellMarketGold <= 0) {
        message.error('售价不对劲')
        return
      }
      this.sellMarketLoading = true
      await marketSellPet(this.sellMarketPet.id, this.sellMarketGold)
      this.getPet()
      message.success('上架成功')
      this.sellMarketLoading = false
      this.sellPetVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.pet /deep/ .ant-card-body{
  overflow-y: scroll!important;
  height: calc(100% - 38px)!important;
  margin-right: -10px;
}
/deep/ .ant-card-grid{
  padding: 0 10px;
  width: 20%;
}
.pet{
  height: 100%;
  width: 100%;
  .action_style{
    display: inline-block;
    margin: 0 5px;
    cursor: pointer;
  }
  .pet_item{
    padding: 8px;
    & > div {
      display: flex;
    }
  }
}
</style>
