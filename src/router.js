import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import store from "./store.js";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      path: "/forgot",
      name: "forgot",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Forgot.vue")
    },
    {
      path: "/404",
      name: "error",
      component: () => import(/* webpackChunkName: "login" */ "./views/404.vue")
    },
    {
      path: "*",
      redirect: { name: "error" }
    }
  ]
});

router.beforeEach((to, from, next) => {
  let jwt = localStorage.getItem("jwt");
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn && jwt) {
      next();
      return;
    }
    store.dispatch("logout").then(router.push("/login"));
    next("/login");
  } else {
    next();
  }
});

// router.afterEach((to, from, next) => {
//   let jwt = localStorage.getItem("jwt");
//   if (!jwt) {
//     store.dispatch("logout").then(router.push("/login"));
//   }
// });

export default router;
