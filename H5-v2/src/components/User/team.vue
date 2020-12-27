<template>
  <a-modal
    title="组队大厅"
    v-model:visible="visible"
    :mask='false'
    :maskClosable='false'
    centered
    @cancel='closeHall'
  >
    <template v-if="teamList.length">
      <div class="team" v-for="t in teamList" :key="t.leader">
        <label>
          Avg.Lv.{{t.avgLv}}
          {{t.leader}}
          ({{t.teammateNum}}/5)
          [{{t.map}}]
        </label>
        <div v-if="t.haspwd">
          <a-input v-model:value="teampwd" placeholder="队伍密码" style="width: 80px" size='small'/>
          <a @click="() => handleJoinTeam(t.leader, true)">加入队伍</a>
        </div>
        <a @click="() => handleJoinTeam(t.leader)" v-else>加入队伍</a>
      </div>
    </template>
    <template #footer>
      <a-input v-model:value="creatdTeampwd" placeholder="队伍密码" style="width: 80px" size='small'/>
      <a @click="handleCreateTeam">创建队伍</a>
      <a @click="handleGetTeamList" style="margin-left: 8px;">刷新</a>
    </template>
  </a-modal>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { createTeam, joinTeam, getTeamList } from '@/api/team'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'

export default defineComponent({
  setup() {
    const store = useStore()
    onMounted(() => {
      handleGetTeamList()
    })
    const visible = computed(() => {
      return store.state.showHall
    })

    const creatdTeampwd = ref('')
    // 关闭组队大厅
    const closeHall = () => {
      store.commit('showTeamHall', false)
      creatdTeampwd.value = ''
      teampwd.value = ''
    }
    // 创建队伍
    const handleCreateTeam = async() => {
      await createTeam(creatdTeampwd.value)
      store.commit('showTeamHall', false)
    }
    // 刷新队伍列表
    const state = reactive({
      teamList: []
    })
    const handleGetTeamList = async() => {
      const { data } = await getTeamList()
      state.teamList = data
    }
    // 加入队伍
    const teampwd = ref('')
    const handleJoinTeam = async(leader, ispsw) => {
      // 如果有组队密码，需要输入密码
      if (ispsw) {
        if (!teampwd.value) {
          message.error('还没输入密码')
          return
        }
      }
      await joinTeam(leader, teampwd.value)
      store.commit('showTeamHall', false)
    }

    return {
      visible,
      closeHall,
      handleCreateTeam,
      handleGetTeamList,
      handleJoinTeam,
      ...toRefs(state),
      creatdTeampwd,
      teampwd
    }
  }
})
</script>

<style lang="less" scoped>
.team {
  display: flex;
  label {
    flex: 1;
  }
}
</style>
