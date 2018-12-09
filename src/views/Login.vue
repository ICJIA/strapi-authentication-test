<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs4 class="grey lighten-4">
        <transition name="fade">
          <v-card class="pt-1 pb-5 pl-3 pr-3" v-if="!this.$store.getters.isLoggedIn">
            <v-card-title primary-title>
              <h2>ICJIA Calendar Login</h2>
            </v-card-title>
            <v-form>
              <v-text-field
                prepend-icon="person"
                name="identifier"
                label="username"
                v-model="identifier"
                autocomplete="identifier"
                ref="identifier"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="password"
                type="password"
                v-model="password"
                autocomplete="password"
              ></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="login">Login</v-btn>
              </v-card-actions>
              <div class="mt-4 mb-3">
                <router-link to="/forgot">I forgot my password</router-link>
              </div>
              <div
                style="height: 50px; color: red; font-weight: bold"
                v-html="this.$store.state.status"
              ></div>
            </v-form>
          </v-card>
        </transition>
        <v-card
          v-if="this.$store.getters.isLoggedIn"
          class="text=xs=center pt-5 pb-5"
        >You're already logged in.
          <br>
          <v-btn @click="logout" class="mt-5">
            <span class="mr-2">LOGOUT</span>
            <v-icon>exit_to_app</v-icon>
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  created() {
    this.$store.commit("clear_status");
  },
  mounted() {
    this.$nextTick(this.$refs.identifier.focus);
  },
  data() {
    return {
      identifier: "",
      password: ""
    };
  },
  methods: {
    login() {
      let identifier = this.identifier;
      let password = this.password;
      this.$store
        .dispatch("login", { identifier, password })
        .then(() => this.$router.push("/"))
        .catch(err => console.log(err));
    },
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    }
  }
};
</script>

<style scoped>
.login-form {
  max-width: 500px;
}
a {
  color: #222;
}
</style>
