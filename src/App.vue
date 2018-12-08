<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>STRAPI</span>&nbsp;
        <span class="font-weight-light">Auth Test</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <span v-if="isLoggedIn">
        <router-link to="/">Home</router-link>&nbsp;|&nbsp;
        <router-link to="/about">About</router-link>

        <v-btn flat @click="logout">
          <span class="mr-2">LOGOUT</span>
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </span>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  created() {
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout);
        }
        throw err;
      });
    });
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>
