<template>
  <div class="attr">
    <a-tooltip placement="topLeft">
      <template #title>
        {{descMsg}}
      </template>
      <QuestionCircleOutlined style="line-height: 24px;margin-right:5px"/>
    </a-tooltip>
    <div>
      {{desc}}：{{attr}}
    </div>
    <label
      class="plus-attr"
      v-if="value > 0"
    >
      +{{value}}
    </label>
    <a-button
      type="primary"
      size="small"
      :disabled="value === 0"
      @mousedown="() => handleMouseDown(-1)"
      @mouseup="() => handleMouseUp()"
      @mouseleave="() => handleMouseUp()"
    >
      <template #icon><MinusOutlined /></template>
    </a-button>
    &nbsp;
    <a-button
      type="primary"
      size="small"
      :disabled="!canOpera"
      @mousedown="() => handleMouseDown(1)"
      @mouseup="() => handleMouseUp()"
      @mouseleave="() => handleMouseUp()"
    >
      <template #icon><PlusOutlined /></template>
    </a-button>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { MinusOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: { MinusOutlined, PlusOutlined, QuestionCircleOutlined },
  props: {
    desc: String,
    attr: Number,
    value: Number,
    canOpera: Boolean,
    descMsg: String
  },
  data() {
    return {
      timer: null
    }
  },
  methods: {
    handleMouseDown(val) {
      this.handleCalc(val)
    },
    handleMouseUp() {
      clearTimeout(this.timer)
    },
    handleCalc(val, time = 500) {
      if (val > 0 && !this.canOpera) {
        return
      }
      if (val < 0 && this.value === 0) {
        return
      }
      this.$emit('update:value', this.value + val)
      this.timer = setTimeout(() => {
        this.handleCalc(val, 100)
      }, time)
    }
  }
})
</script>
<style lang="less" scoped>
.attr {
  display: flex;
  margin-bottom: 8px;
  & > div {
    flex: 1;
  }
  .plus-attr {
    color: red;
    margin-right: 8px;
  }
}
</style>
