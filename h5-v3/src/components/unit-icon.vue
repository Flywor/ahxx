<template>
  <UserOutlined v-if="type == 'player'" />
  <RedditOutlined v-else-if="type == 'npc'" />
  <MobileOutlined v-else-if="type == 'io'" />
  <RobotOutlined v-else-if="type == 'm1'" />
  <AliwangwangOutlined v-else-if="type == 'm2'" style="color:blue" />
  <GitlabOutlined v-else-if="type == 'm3'" style="color:orange" />
  <QqOutlined v-else-if="type == 'm4'" style="color:red" />
  <SlackOutlined v-else-if="type == 'herb'" />
  <CloudOutlined v-else-if="type == 'ore'" />
  <GiftOutlined v-else-if="type == 't1'" />
  <GiftOutlined v-else-if="type == 't2'" style="color:orange"/>
  <GiftOutlined v-else-if="type == 't3'" style="color:red" />
  <ShopOutlined v-else-if="type == 'shop'" />
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
  RobotOutlined,
  SlackOutlined,
  CloudOutlined,
  GiftOutlined,
  ShopOutlined
} from '@ant-design/icons-vue'
withDefaults(defineProps<{
  type: string
}>(), {
  type: ''
})
</script>