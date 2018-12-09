<template>
  <v-container>
    <h1 class="mb-3">Home</h1>
    <div class="pl-3 pr-3">
      <h3 class="rule mt-3">Authenticated userMeta:</h3>
      <tree-view :data="this.$store.state.userMeta" :options="{maxDepth: 3, link: true}"></tree-view>

      <h3 class="rule mt-3">Axios authorization headers</h3>
      <tree-view :data="$http.defaults.headers.common" :options="{maxDepth: 3, link: true}"></tree-view>

      <h3 class="rule mt-3">
        Authenticated content from:
        <a
          href="https://strapidev.icjia-api.cloud/posts"
        >https://strapidev.icjia-api.cloud/posts</a>
      </h3>
      <tree-view :data="posts" :options="{maxDepth: 3, link: true}"></tree-view>
    </div>
  </v-container>
</template>

<script>
import config from "@/config";
export default {
  name: "home",
  components: {},
  data() {
    return {
      posts: null
    };
  },
  async created() {
    await this.$http
      .get(`${config.api.baseApi}${config.api.postsRoute}`)
      .then(response => {
        this.posts = response.data;
      })
      .catch(error => {
        this.$store.dispatch("logout").then(() => {
          this.$router.push("/login");
        });
      });
  },
  mounted() {}
};
</script>

<style scoped>
h3.rule {
  border-bottom: 1px solid #ccc !important;
  padding-bottom: 8px !important;
  margin-bottom: 15px;
}
</style>
