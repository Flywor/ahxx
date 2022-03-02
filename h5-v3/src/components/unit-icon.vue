<template>
  <UserOutlined v-if="type == 'player'" />
  <RedditOutlined v-else-if="type == 'npc'" />
  <MobileOutlined v-else-if="type == 'io'" />
  <BugOutlined v-else-if="type == 'm1'" />
  <AliwangwangOutlined v-else-if="type == 'm2'" style="color:green" />
  <GitlabOutlined v-else-if="type == 'm3'" style="color:orange" />
  <QqOutlined v-else-if="type == 'm4'" style="color:red" />
  <SlackOutlined v-else-if="type == 'herb'" />
  <CloudOutlined v-else-if="type == 'ore'" />
  <GiftOutlined v-else-if="type == 't1'" />
  <GiftOutlined v-else-if="type == 't2'" style="color:orange"/>
  <GiftOutlined v-else-if="type == 't3'" style="color:red" />
</template>
<script setup lang="ts">
import { withDefaults } from 'vue'
import {
  UserOutlined,
  RedditOutlined,
  MobileOutlined,
  AliwangwangOutlined,
  GitlabOutlined,
  QqOutlined,
  BugOutlined,
  SlackOutlined,
  CloudOutlined,
  GiftOutlined,
} from '@ant-design/icons-vue'
withDefaults(defineProps<{
  type: string
}>(), {
  type: ''
})
</script>