<template>
  <div class="equip">
    <a-list item-layout="horizontal" :data-source="skillList">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a>
                {{ item.name }}
              </a>
            </template>
            <template #description>
              <p>{{item.mark}}</p>
              <p v-if="item.maturity || item.maturity == 0">
                熟练度：{{getPower(item)}}%
              </p>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <a-alert message="技能熟练度与技能威力直接挂钩，最高200%" type="info" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import request from '@/util/request'
import { store } from '@/store'
const skillList = computed(() => store.state.skillList)

const getPower = (skl: any) => {
  let sklPower = skl.maturity / 30000 + 1
  if (sklPower > 2) {
    sklPower = 2
  }
  return (sklPower * 100).toFixed(2)
}
</script>