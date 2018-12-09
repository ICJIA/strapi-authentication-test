<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/">
          <span>STRAPI</span>&nbsp;
          <span class="font-weight-light">Auth Test</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <span v-if="isLoggedIn">
        <router-link to="/">Home</router-link>&nbsp;|&nbsp;
        <router-link to="/about">About</router-link>

        <v-btn flat @click="logout">
          <span class="mr-2">SIGN OUT {{this.$store.state.userMeta.username}}</span>
          <v-icon>lock_open</v-icon>
        </v-btn>
      </span>
      <span v-else>
        <v-btn flat @click="logout">
          <span class="mr-2">SIGN IN</span>
          <v-icon>lock</v-icon>
        </v-btn>
      </span>
    </v-toolbar>

    <v-content>
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
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
    const userMeta = localStorage.getItem("userMeta");
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
<style scoped>
a {
  color: #555 !important;
  text-decoration: none;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
