import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);
Vue.prototype.$http = axios;

export default new Vuex.Store({
  state: {
    status: "",
    jwt: localStorage.getItem("jwt") || "",
    userMeta: JSON.parse(localStorage.getItem("userMeta")) || "",
    user: {}
  },
  mutations: {
    auth_request(state) {
      // state.status = "Loading";
    },
    auth_success(state, { jwt, userMeta }) {
      state.status = "success";
      state.jwt = jwt;
      state.userMeta = userMeta;
    },
    auth_reset(state, message) {
      state.status = message;
    },

    auth_error(state, err) {
      state.status = `${err}`;
    },
    clear_status(state) {
      state.status = ``;
    },
    logout(state) {
      state.status = "";
      state.jwt = "";
      state.user = {};
    }
  },
  actions: {
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("jwt");
        localStorage.removeItem("userMeta");
        delete Vue.prototype.$http.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    reset({ commit }, payload) {
      commit("clear_status");
      return new Promise((resolve, reject) => {
        commit("clear_status");
        Vue.prototype
          .$http({
            url: "https://strapidev.icjia-api.cloud/auth/reset-password",
            data: payload,
            method: "POST"
          })
          .then(resp => {
            commit("auth_reset", "Success! You've reset your password.");
            commit("logout");
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            delete Vue.prototype.$http.defaults.headers.common["Authorization"];
            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);
            console.log(statusCode);
            console.log(err);
            let message = JSON.parse(JSON.stringify(err.response.data.message));

            commit(
              "auth_error",
              `<h3>ERROR:</h3>${message}<div>Your password was not reset.</div>`
            );

            reject(err);
          });
      });
    },
    forgot({ commit }, email) {
      commit("clear_status");
      return new Promise((resolve, reject) => {
        // commit("auth_request");
        console.log("email: ", email);

        let data = {};
        data.email = email;

        data.url = "https://strapi-auth.netlify.com/reset";
        console.log(data);
        Vue.prototype
          .$http({
            url: "https://strapidev.icjia-api.cloud/auth/forgot-password",
            data: data,
            method: "POST"
          })
          .then(resp => {
            commit(
              "auth_reset",
              `<h3>Success!</h3><div>Please check your email for your reset link.</div>`
            );

            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);
            console.log(statusCode);
            console.log(err);

            let message = JSON.parse(JSON.stringify(err.response.data.message));
            commit("auth_error", `<h3>ERROR:</h3>${message}`);
            localStorage.removeItem("jwt");
            reject(err);
          });
      });
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");

        Vue.prototype
          .$http({
            url: "https://strapidev.icjia-api.cloud/auth/local",
            data: user,
            method: "POST"
          })
          .then(resp => {
            console.log(resp);
            const jwt = resp.data.jwt;
            const userMeta = resp.data.user;
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("userMeta", JSON.stringify(userMeta));
            Vue.prototype.$http.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${jwt}`;
            commit("auth_success", { jwt, userMeta });
            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);

            let message = "";
            if (statusCode == 400) {
              message = "Your Username or Password was incorrect";
            } else {
              message = `Network error. Status code: ${statusCode}`;
            }
            commit("auth_error", message);
            localStorage.removeItem("jwt");
            reject(err);
          });
      });
    }
  },
  getters: {
    isLoggedIn: state => !!state.jwt,
    authStatus: state => state.status,
    userMeta: state => state.userMeta
  }
});
