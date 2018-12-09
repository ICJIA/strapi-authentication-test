import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import config from "@/config";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    jwt: localStorage.getItem("jwt") || "",
    userMeta: JSON.parse(localStorage.getItem("userMeta")) || "",
    user: {}
  },
  mutations: {
    auth_request(state) {
      state.status = "<img src='/loading.gif' />";
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
      state.status = `<div style='color: red'>${err}</div>`;
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
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    reset({ commit }, payload) {
      commit("clear_status");
      return new Promise((resolve, reject) => {
        commit("clear_status");
        axios({
          url: `${config.api.baseApi}${config.api.resetPassword}`,
          data: payload,
          method: "POST"
        })
          .then(resp => {
            commit(
              "auth_reset",
              `<div style="color: green">Success! You've reset your password.</div>`
            );
            commit("logout");
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            delete axios.defaults.headers.common["Authorization"];
            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);
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
        commit("auth_request");

        let data = {};
        data.email = email;
        data.url = `${config.api.baseClient}${
          config.api.resetPasswordCallback
        }`;

        axios({
          url: `${config.api.baseApi}${config.api.forgetPassword}`,
          data: data,
          method: "POST"
        })
          .then(resp => {
            commit(
              "auth_reset",
              `<div style="color: green"><h3>Success!</h3><div>Please check your email for your reset link.</div></div>`
            );

            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);

            let message = JSON.parse(JSON.stringify(err.response.data.message));
            commit("auth_error", `<h3>ERROR:</h3>${message}`);
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
            reject(err);
          });
      });
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: `${config.api.baseApi}${config.api.login}`,
          data: user,
          method: "POST"
        })
          .then(resp => {
            const jwt = resp.data.jwt;
            const userMeta = resp.data.user;
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("userMeta", JSON.stringify(userMeta));
            axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
            commit("auth_success", { jwt, userMeta });
            resolve(resp);
          })
          .catch(err => {
            console.log("error");
            let message = JSON.parse(JSON.stringify(err.response.data.message));
            commit("auth_error", message);
            localStorage.removeItem("jwt");
            localStorage.removeItem("userMeta");
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
