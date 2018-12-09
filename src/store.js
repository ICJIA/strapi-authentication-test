import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

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
      // state.status = "Loading";
    },
    auth_success(state, { jwt, userMeta }) {
      state.status = "success";
      state.jwt = jwt;
      state.userMeta = userMeta;
    },
    auth_reset(state) {
      state.status = `Success! Please check your email for your reset link`;
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
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    forgot({ commit }, email) {
      commit("clear_status");
      return new Promise((resolve, reject) => {
        // commit("auth_request");
        console.log("email: ", email);

        let data = {};
        data.email = email;

        data.url =
          "https://strapidev.icjia-api.cloud/admin/plugins/users-permissions/auth/reset-password";
        console.log(data);
        axios({
          url: "https://strapidev.icjia-api.cloud/auth/forgot-password",
          data: data,
          method: "POST"
        })
          .then(resp => {
            commit("auth_reset");
            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);
            console.log(statusCode);
            console.log(err);
            let message = "";
            if (statusCode == 400) {
              message = "Your email was incorrect.";
            } else {
              message = `Network error. Status code: ${statusCode}`;
            }
            commit("auth_error", message);
            localStorage.removeItem("jwt");
            reject(err);
          });
      });
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");

        axios({
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
            axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
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
