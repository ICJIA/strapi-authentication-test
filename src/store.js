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
    auth_error(state, err) {
      state.status = `${err}`;
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
