<template>
  <div>
    <v-container>
      <h1 class="mb-3">Home</h1>
      <h4>
        Authenticated content from:
        <a
          href="https://strapidev.icjia-api.cloud/posts"
        >https://strapidev.icjia-api.cloud/posts</a>
      </h4>
      {{posts}}
    </v-container>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      posts: null
    };
  },
  async created() {
    this.$http
      .get("https://strapidev.icjia-api.cloud/posts")
      .then(response => {
        this.posts = response.data;
      })
      .catch(error => {
        console.log("An error occurred:", error);
      });
  },
  mounted() {}
};
</script>
