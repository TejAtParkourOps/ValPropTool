import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    redirect: { name: "create" },
  },
  {
    path: "/user",
    name: "user",
    component: () =>
      import(/* webpackChunkName: "account" */ "../views/UserView.vue"),
  },
  {
    path: "/user/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "account" */ "../views/LoginView.vue"),
  },
  {
    path: "/user/account",
    name: "account",
    component: () =>
      import(/* webpackChunkName: "account" */ "../views/AccountView.vue"),
  },
  {
    path: "/create",
    name: "create",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "propositions" */ "../views/CanvasView.vue"),
  },
  {
    path: "/propositions",
    name: "propositions",
    component: () =>
      import(
        /* webpackChunkName: "propositions" */ "../views/PropositionsView.vue"
      ),
  },
  {
    path: "/propositions/:ownerId/:propositionId",
    name: "proposition",
    component: () =>
      import(/* webpackChunkName: "propositions" */ "../views/CanvasView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
