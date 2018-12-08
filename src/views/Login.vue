<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs3 class="grey lighten-4">
        <transition name="fade">
          <v-card class="pt-1 pb-5 pl-3 pr-3" v-if="!this.$store.getters.isLoggedIn">
            <v-card-title primary-title>
              <h2>Login</h2>
            </v-card-title>
            <v-form>
              <v-text-field
                prepend-icon="person"
                name="identifier"
                label="username"
                v-model="identifier"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="password"
                type="password"
                v-model="password"
              ></v-text-field>
              <v-card-actions>
                <v-btn primary large block @click="login">Login</v-btn>
              </v-card-actions>
              <div class="mt-3" style="color: red">{{this.$store.state.status}}</div>
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
  created() {},
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
      console.log(identifier, password);
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>