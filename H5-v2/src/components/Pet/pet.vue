<template>
  <a-card title="宠物" class="pet" size="small">
    <template #extra>
      <a @click="getPet">刷新</a>
    </template>
    <a-list :grid="{ gutter: 8, lg: 1, xxl: 3 }" :data-source="petList">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card>
            <h3>
              Lv.{{item.lv}} {{item.name}}
              <a-button type="primary" size="small" @click="() => handleSwitchPetStatus(item.id)">
                {{statusMap[item.status]}}
              </a-button>
              <a-button type="danger" size="small" @click="() => handleDiscardPet(item.id)">
                丢弃
              </a-button>
              <a-button size="small" @click="() => handleRebornPet(item.id)">
                洗宠
              </a-button>
            </h3>
            <div>经验：{{item.exp_c}}/{{item.exp}}</div>
            <div>HP：{{item.hp}}</div>
            <div>HP成长：{{formatDouble(item.hpGrow)}}</div>
            <div>MP：{{item.hp}}</div>
            <div>MP成长：{{formatDouble(item.mpGrow)}}</div>
            <div>物攻：{{item.atk}}</div>
            <div>物攻成长：{{formatDouble(item.atkGrow)}}</div>
            <div>法攻：{{item.magic}}</div>
            <div>法攻成长：{{formatDouble(item.magicGrow)}}</div>
            <div>物御：{{item.def}}</div>
            <div>物御成长：{{formatDouble(item.defGrow)}}</div>
            <div>法抗：{{formatPercent(item.magicDef)}}</div>
            <div>速度：{{item.speed}}</div>
            <div>速度成长：{{formatDouble(item.speedGrow)}}</div>
            <div>技能：{{item.skills.join('，')}}</div>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
<script>
import { getPetList, switchPetStatus, discardPet, rebornPet } from '@/api/pet'
import { formatPercent } from '@/util/tools'
export default {
  data() {
    return {
      statusMap: {
        0: '休息',
        1: '出战'
      },
      petList: [],
      formatPercent
    }
  },
  mounted() {
    this.getPet()
  },
  methods: {
    formatDouble(val) {
      return Number(val).toFixed(2)
    },
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
      console.log(petId)
      await rebornPet(petId)
      this.getPet()
    }
  }
}
</script>
<style lang="less" scoped>
.pet {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
