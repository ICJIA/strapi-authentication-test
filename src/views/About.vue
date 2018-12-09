<template>
  <div>
    <v-container>
      <h1>About Page here</h1>
      <h3 class="rule mt-3">userMeta:</h3>
      <tree-view :data="this.$store.state.userMeta" :options="{maxDepth: 3, link: true}"></tree-view>

      <h3 class="rule mt-3">axios headers</h3>
      <tree-view :data="$http.defaults.headers.common" :options="{maxDepth: 3, link: true}"></tree-view>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  created() {}
};
</script>

<style scoped>
</style>
