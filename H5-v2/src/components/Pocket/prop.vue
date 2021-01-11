<template>
  <a-popover>
    <template #title>
      <h3 :style="{ color: qualityMap[prop.quality].color }">
        {{prop.name}}
      </h3>
    </template>
    <template #content>
      <div style="padding-left: 8px;">
        {{prop.mark}}
      </div>
    </template>
    <span :style="{ color: qualityMap[prop.quality].color }">{{prop.name}}</span>x{{prop.count}}
  </a-popover>
</template>
<script>
import { qualityMap } from '@/util/enum'
export default {
  props: {
    prop: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return { qualityMap }
  }
}
</script>
<style scoped lang="less">

</style>
