<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs4>
        <v-card class="pt-1 pb-5 pl-3 pr-3">
          <v-card-title primary-title>
            <h2>Reset Password</h2>
          </v-card-title>
          <v-form v-if="hasCode">
            <v-text-field
              prepend-icon="lock"
              name="password"
              label="password"
              v-model="password"
              type="password"
              autocomplete="password"
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              name="passwordConfirmation"
              label="passwordConfirmation"
              type="password"
              v-model="passwordConfirmation"
              autocomplete="passwordConfirmation"
            ></v-text-field>
            <div style="color: red; font-size: 12px">{{matchStatus}}</div>
            <v-card-actions class="mt-2">
              <v-btn primary large block @click="reset">Reset</v-btn>
            </v-card-actions>
          </v-form>
          <div v-else>
            <v-btn primary large block @click="forgot">Get password reset link</v-btn>
          </div>

          <div
            style="height: 50px; color: red; font-weight: bold"
            class="mt-3"
            v-html="this.$store.state.status"
          ></div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  created() {
    this.$store.commit("clear_status");
    let code = this.$route.query.code;
    if (!code) {
      this.hasCode = false;
    } else {
      this.hasCode = true;
      this.code = this.$route.query.code;
    }
  },
  data() {
    return {
      password: "",
      passwordConfirmation: "",
      matchStatus: "",
      hasCode: false
    };
  },
  methods: {
    forgot() {
      this.$router.push("/forgot");
    },
    reset() {
      let password = this.password.toString();
      let passwordConfirmation = this.passwordConfirmation.toString();
      let payload = {};
      payload.code = this.code;
      payload.password = password;
      payload.passwordConfirmation = passwordConfirmation;

      if (this.password !== this.passwordConfirmation) {
        this.matchStatus = "Passwords must match";
      } else {
        this.matchStatus = "";
        console.log(payload);
        this.$store
          .dispatch("reset", payload)
          .then(() => this.$router.push("/"))
          .catch(err => console.log(err));
      }
    }
  }
};
</script>

<style scoped>
</style>