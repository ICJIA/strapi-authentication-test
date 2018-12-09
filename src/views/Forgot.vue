<template>
  <v-container fill-height>
    <v-layout row class="text-xs-center" align-center justify-center>
      <v-flex xs4 class="grey lighten-4">
        <transition name="fade">
          <v-card class="pt-1 pb-5 pl-3 pr-3">
            <v-card-title primary-title>
              <h2>Reset my Password</h2>
            </v-card-title>
            <v-form>
              <v-text-field
                prepend-icon="person"
                name="email"
                label="email"
                v-model="email"
                ref="email"
              ></v-text-field>

              <v-card-actions>
                <v-btn primary large block @click="reset">Send Reset Link</v-btn>
              </v-card-actions>

              <div
                style="height: 50px; color: red; font-weight: bold"
                class="mt-3"
                v-html="this.$store.state.status"
              ></div>
            </v-form>
          </v-card>
        </transition>
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
    this.$nextTick(this.$refs.email.focus);
  },
  data() {
    return {
      email: ""
    };
  },
  methods: {
    reset() {
      let email = this.email.toString();
      console.log("Email: ", email);
      this.$store.dispatch("forgot", email);
    }
  }
};
</script>

<style scoped>
</style>
