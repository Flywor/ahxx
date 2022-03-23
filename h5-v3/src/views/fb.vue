<template>
  <div class="fb">
    <div class="s">
      <p>
        先天法宝
      </p>
      <p>
        {{fb.quality}}阶{{fb.lv}}级
        <a-tooltip placement="right">
          <QuestionCircleTwoTone style="font-size:14px;"/>
          <template #title>
            <div>玩家每次击杀大于等于(品阶*10+等级)的怪物可以使法宝累计经验</div>
            <div>法宝每次升级都有(3+品阶)点属性点按比例分配</div>
            <div>法宝每10级需消耗灵石(品阶*10000)进行升阶才可继续升级</div>
            <div>法宝升阶后会重置分配比例</div>
            <div>其中HP、MP、每秒金币获取*10，防御获取/2</div>
            <div>根骨：随机+HP或MP</div>
            <div>强壮：随机+物防或法防</div>
            <div>力量：随机+物攻或法攻</div>
            <div>锋利：随机+物穿或法穿</div>
            <div>财富：增加每秒金币获取</div>
            <div>恢复：随机+每秒回血或回蓝</div>
          </template>
        </a-tooltip>
      </p>
    </div>
    <div id="bility"></div>
    <div style="text-align:center;margin-top:8px;">
      <a-tooltip placement="top">
        <a style="margin-right:16px;color:red;" @click="handleResetFB" v-if="!fb.readyLvUp">重置法宝</a>
        <template #title>
          回到0阶0级，消耗品阶*100万金币
        </template>
      </a-tooltip>
      <a-tooltip placement="top">
        <a @click="handleRollFB" v-if="!fb.readyLvUp">重置比例</a>
        <template #title>
          {{fb.quality * 1000}}灵石
        </template>
      </a-tooltip>
      <a-tooltip placement="top" v-if="fb.exp >= lvupExp && fb.lv == 10">
        <a style="margin-left:16px" @click="handleStageLvUpFB">升阶</a>
        <template #title>
          <label>{{fb.quality * 10000}}灵石</label>
        </template>
      </a-tooltip>
    </div>
    <div style="text-align:center;margin-top:8px;">
      经验：{{fb.exp}}/{{lvupExp}}
      <a @click="handleLvUpFB" v-if="fb.exp >= lvupExp && fb.lv != 10 && !fb.readyLvUp">升级</a>
    </div>
    <a-divider>提供属性</a-divider>
    <div class="attr">
      <p v-if="fb.hp || fb.tempHp">
        HP：{{fb.hp}}
        <label v-if="fb.tempHp">+{{fb.tempHp}}</label>
      </p>
      <p v-if="fb.mp || fb.tempMp">
        MP：{{fb.mp}}
        <label v-if="fb.tempMp">+{{fb.tempMp}}</label>
      </p>
      <p v-if="fb.hpSec || fb.tempHpSec">
        每秒恢复HP：{{fb.hpSec}}
        <label v-if="fb.tempHpSec">+{{fb.tempHpSec}}</label>
      </p>
      <p v-if="fb.mpSec || fb.tempMpSec">
        每秒恢复MP：{{fb.mpSec}}
        <label v-if="fb.tempMpSec">+{{fb.tempMpSec}}</label>
      </p>
      <p v-if="fb.maxAtk || fb.tempMaxAtk">
        物攻上限：{{fb.maxAtk}}
        <label v-if="fb.tempMaxAtk">+{{fb.tempMaxAtk}}</label>
      </p>
      <p v-if="fb.maxMagic || fb.tempMaxMagic">
        法攻上限：{{fb.maxMagic}}
        <label v-if="fb.tempMaxMagic">+{{fb.tempMaxMagic}}</label>
      </p>
      <p v-if="fb.def || fb.tempDef">
        物理防御：{{fb.def}}
        <label v-if="fb.tempDef">+{{fb.tempDef}}</label>
      </p>
      <p v-if="fb.magicDef || fb.tempMagicDef">
        法术防御：{{fb.magicDef}}
        <label v-if="fb.tempMagicDef">+{{fb.tempMagicDef}}</label>
      </p>
      <p v-if="fb.neglectDef || fb.tempNeglectDef">
        物防穿透：{{fb.neglectDef}}点
        <label v-if="fb.tempNeglectDef">+{{fb.tempNeglectDef}}</label>
      </p>
      <p v-if="fb.neglectMagicDef || fb.tempNeglectMagicDef">
        法防穿透：{{fb.neglectMagicDef}}点
        <label v-if="fb.tempNeglectMagicDef">+{{fb.tempNeglectMagicDef}}</label>
      </p>
      <p v-if="fb.gold || fb.tempGold">
        每秒金币：{{fb.gold}}
        <label v-if="fb.tempGold">+{{fb.tempGold}}</label>
      </p>
    </div>
    <div style="text-align:center;margin:8px 0;" v-if="fb.readyLvUp">
      <a style="margin-right:16px;color:orange" @click="handleConfirmLvUp(false)">取消升级</a>
      <a style="margin-left:16px;" @click="handleConfirmLvUp(true)">确定升级</a>
    </div>
    <a-alert v-if="fb.readyLvUp" message="取消升级扣除50%升级经验，重置升级点数分配；确认升级后会清空已有法宝经验；" type="info" />
  </div>
</template>
<script setup lang="ts">
import { HeatMapOutlined, QuestionCircleTwoTone } from '@ant-design/icons-vue'
import { onMounted, reactive, computed, watch } from 'vue'
import { store } from '@/store'
import request from '@/util/request'
import { Modal } from 'ant-design-vue'
const state = reactive({
  chart: null
})
watch(() => store.state.fb, () => {
  setChart()
})
const fb = computed(() => store.state.fb)
const lvupExp = computed(() => Math.pow(store.state.fb.quality + 1, 2) * 100)

onMounted(() => {
  const bility = document.getElementById('bility')
  state.chart = window.echarts.init(bility)
  setChart()
})

const setChart = () => {
  const fb = store.state.fb
  const max = Math.max(fb.hpmp, fb.defdef, fb.atkatk, fb.negneg, fb.goldgold, fb.recrec)
  state.chart.setOption({
    radar: {
      indicator: [
        { name: '根骨', max },
        { name: '强壮', max },
        { name: '力量', max },
        { name: '锋利', max },
        { name: '财富', max },
        { name: '恢复', max }
      ]
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [fb.hpmp, fb.defdef, fb.atkatk, fb.negneg, fb.goldgold, fb.recrec]
          }
        ]
      }
    ]
  })
}
const handleResetFB = () => {
  Modal.confirm({
    title: '防手残确认框',
    content: '本当にこれを売るの?',
    onOk() {
      request({
        url: '/resetFB',
        method: 'post'
      })
    }
  })
}
const handleRollFB = () => {
  Modal.confirm({
    title: '防手残确认框',
    content: '本当にこれを売るの?',
    onOk() {
      request({
        url: '/rollFB',
        method: 'post'
      })
    }
  })
}
const handleLvUpFB = () => {
  request({
    url: '/readyToLvUpFB',
    method: 'post'
  })
}
const handleConfirmLvUp = (flag: boolean) => {
  request({
    url: '/confirmToLvUpFB',
    method: 'post',
    data: { ok: flag }
  })
}
const handleStageLvUpFB = () => {
  request({
    url: '/stageLvUpFB',
    method: 'post'
  })
  
}
</script>
<style lang="less" scoped>
.fb {
  .s {
    color: #d3c3ae;
    text-align: center;
    margin: 0 auto;
    display: block;
    font-size: 60px;
    p {
      font-size: 24px;
    }
  }
  #bility {
    width: 100%;
    height: 230px;
  }
  .attr {
    label {
      margin-left: 8px;
      color: red;
    }
  }
}
</style>