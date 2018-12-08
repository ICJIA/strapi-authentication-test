import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import axios from "axios";

Vue.prototype.$http = axios;
const jwt = localStorage.getItem("jwt");

if (jwt) {
  Vue.prototype.$http.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${jwt}`;
}

let vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
