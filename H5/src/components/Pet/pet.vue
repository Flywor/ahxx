<template>
  <a-list :grid="{ gutter: 16, xs: 12, md: 12, xl: 8, xxl: 4 }" :data-source="petList" class="pet">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card :title="`【${statusMap[item.status]}】Lv.${item.lv} ${item.name}`">
          <div>经验：{{item.exp_c}}/{{item.exp}}</div>
          <div>血量：{{item.hp}}</div>
          <div>攻击：{{item.atk}}</div>
          <div>防御：{{item.def}}</div>
          <div>速度：{{item.speed}}</div>
          <div>技能：{{item.skills.join('，')}}</div>
          <a-button type="primary" size="small" @click="() => handleSwitchPetStatus(item.id)">
            {{item.status === 0?'战': '息'}}
          </a-button>
          <a-button type="danger" size="small" @click="() => handleDiscardPet(item.id)">
            丢
          </a-button>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
  <a @click="getPet">刷新</a>
</template>
<script>
import { getPetList, switchPetStatus, discardPet } from '@/api/pet'
export default {
  data() {
    return {
      statusMap: {
        0: '休息',
        1: '出战'
      },
      petList: []
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
    }
  }
}
</script>
<style lang="less" scoped>
.pet {
  width: 100%;
}
</style>
