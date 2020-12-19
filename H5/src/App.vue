<template>
  <div class="appcontent">
    <div class="router">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="less">
#app {
  width:  100%;
  height:  100%;
}
.appcontent {
  width:  100%;
  height:  100%;
  .router {
    width: 100%;
    height: 100%;
  }
}
/*修改滚动条样式*/
::-webkit-scrollbar{
  width:10px;
  height:10px;
  /**/
}
// ::-webkit-scrollbar-track{
//   background: rgb(239, 239, 239);
//   border-radius:2px;
// }
// ::-webkit-scrollbar-thumb{
//   background: #bfbfbf;
//   border-radius:10px;
// }
</style>
