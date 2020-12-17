<template>
  <div class="usually">
    <div class="usually-left">
      <a-button class="btn">背包</a-button>
      <a-button class="btn">合成</a-button>
      <a-button class="btn">宠物</a-button>
      <a-button class="btn">技能</a-button>
    </div>
    <div class="usually-center">
      <img :src="XxImg" />
      <div v-if="!team || (team && isLeader)">
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link">
            {{battleMap}}<DownOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="md in mapData" :key="md._id">
                <a @click="() => handleSetBattleMap(md._id)">Lv{{md.lv}}.{{md.name}}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button :type="isBattle?'danger':'primary'" class="btn" size="small" style="margin-left:12px" @click="handleStartBattle">
          {{isBattle?'停止':'开始'}}修炼
        </a-button>
      </div>
      <div v-else>
        {{battleMap}}
      </div>
    </div>
    <div class="usually-right">
      <a-button type="primary" class="btn">商店</a-button>
      <a-button type="primary" class="btn">摆摊</a-button>
      <a-button type="primary" class="btn">任务</a-button>
      <a-button type="primary" class="btn">资料</a-button>
    </div>
  </div>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue'
import XxImg from '@/assets/xx.jpg'
import { moveToMap } from '@/api/player'
import { battleStart } from '@/api/team'
import MapData from '@/data/Map.json'
console.log(MapData)
export default {
  components: { DownOutlined },
  data() {
    return {
      mapData: MapData,
      XxImg,
      isBattle: false,
      autoBattleInetval: null
    }
  },
  computed: {
    isLeader() {
      return this.$store.state.isLeader
    },
    team() {
      return this.$store.state.team
    },
    battleMap() {
      const bm = this.$store.state.battleMap
      return (this.mapData.find(md => md._id === bm) || {}).name
    }
  },
  watch: {
    '$store.state.battle': {
      deep: true,
      handler(btl) {
        if (btl === null && this.isBattle) {
          setTimeout(() => {
            this.autoStartBattle()
          }, 3333)
        }
      }
    }
  },
  methods: {
    handleStartBattle() {
      if (this.isBattle) {
        this.isBattle = false
      } else if (!this.$store.state.battle) {
        this.isBattle = true
        this.autoStartBattle()
      }
    },
    async autoStartBattle() {
      const { code } = await battleStart()
      if (code !== 200) {
        setTimeout(() => {
          this.autoStartBattle()
        }, 1000)
      }
    },
    handleSetBattleMap(mapid) {
      moveToMap(mapid)
    }
  }
}
</script>

<style lang="less" scoped>
.usually{
  width: 100%;
  display: flex;
  align-items: center;
  &-left, &-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn {
      margin: 8px 0;
      background: #E09D71;
      border-color: #f89d60;
      color: #fff;
      &:hover {
        opacity: .7;
      }
    }
  }
  &-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
