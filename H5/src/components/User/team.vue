<template>
  <a-modal
    title="组队大厅"
    v-model:visible="visible"
    :mask='false'
    :maskClosable='false'
    :footer="null"
    @cancel='closeHall'
  >
    <a-card title="所有队伍" size="small">
      <template #extra>
        创建队伍密码
        <a-input v-model:value="creatdTeampwd" style="width: 80px" size='small'/>
        <a @click="handleCreateTeam">创建队伍</a>
        <a @click="handleGetTeamList" style="margin-left: 8px;">刷新</a>
      </template>
      <template v-if="teamList.length">
        <div class="team" v-for="t in teamList" :key="t.leader">
          <label>
            Lv.{{t.avgLv}}
            {{t.leader}}
            ({{t.teammateNum}}/5)
            [{{t.map}}]
          </label>
          <!-- haspwd 是我虚构的是否有组队密码的字段 -->
          <a-popover v-model:visible="t.haspwd" title="Title" trigger="click" v-if="t.haspwd">
            <template #content>
              输入队伍密码
              <a-input v-model:value="teampwd" style="width: 80px" size='small'/>
              <a @click="() => {handleJoinTeam(t.leader)}">确定</a>
            </template>
            <a @click="() => t.haspwd = true">加入队伍</a>
          </a-popover>
          <a @click="() => handleJoinTeam(t.leader)" v-else>加入队伍</a>
        </div>
      </template>
    </a-card>
  </a-modal>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { createTeam, joinTeam, getTeamList } from '@/api/team'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    onMounted(() => {
      handleGetTeamList()
    })
    const visible = computed(() => {
      return store.state.showHall
    })
    const haspwd = ref(true)

    const creatdTeampwd = ref('')
    // 关闭组队大厅
    const closeHall = () => {
      // visible.value = false
      store.commit('showTeamHall', false)
      creatdTeampwd.value = ''
      teampwd.value = ''
    }
    // 创建队伍
    const handleCreateTeam = async() => {
      await createTeam(creatdTeampwd.value)
      // visible.value = false
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
    const addTeam = ref(false)
    const handleJoinTeam = async(leader) => {
      // 如果有组队密码，需要输入密码
      if (haspwd.value) {
        addTeam.value = true
        await joinTeam(leader, teampwd.value)
        store.commit('showTeamHall', false)
      } else {
        await joinTeam(leader)
        store.commit('showTeamHall', false)
      }
    }

    return {
      visible,
      closeHall,
      handleCreateTeam,
      handleGetTeamList,
      handleJoinTeam,
      ...toRefs(state),
      haspwd,
      creatdTeampwd,
      addTeam,
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
