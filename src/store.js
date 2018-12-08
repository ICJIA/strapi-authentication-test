import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    jwt: localStorage.getItem("jwt") || "",
    user: {}
  },
  mutations: {
    auth_request(state) {
      // state.status = "Loading";
    },
    auth_success(state, { jwt, user }) {
      state.status = "success";
      state.jwt = jwt;
      state.user = user;
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
        console.log(user);
        axios({
          url: "https://strapidev.icjia-api.cloud/auth/local",
          data: user,
          method: "POST"
        })
          .then(resp => {
            console.log(resp);
            const jwt = resp.data.jwt;
            const user = resp.data.user;
            localStorage.setItem("jwt", jwt);

            axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
            commit("auth_success", { jwt, user });
            resolve(resp);
          })
          .catch(err => {
            let statusCode = JSON.stringify(err.response.data.statusCode);
            console.log(statusCode);
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
    authStatus: state => state.status
  }
});
