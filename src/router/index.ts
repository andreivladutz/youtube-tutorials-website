import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

import store from "@/store";
import { RootVueApp } from "@/main";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/admin",
    name: "Admin",
    // route level code-splitting
    // this generates a separate chunk (admin.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/Admin.vue"),
  },
  {
    path: "/admin/edit",
    name: "AdminEdit",
    // route level code-splitting
    // this generates a separate chunk (admin.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "adminEdit" */ "../views/AdminEdit.vue"),
  },
  {
    path: "*",
    component: () =>
      import(/* webpackChunkName: "notFound" */ "../views/404.vue"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach(async (to, from, next) => {
  (router.app as RootVueApp).loading = true;

  if (!["Admin", "AdminEdit"].includes(to.name as string)) {
    return next();
  }

  const signedIn = await store.dispatch("firebase/checkSignedInStatus");

  // Don't let the user login again if he is already logged in (as admin)
  if (signedIn && to.name === "Admin") {
    // Redirect to edit automatically
    return next("/admin/edit");
  } else if (!signedIn && to.name === "AdminEdit") {
    return next("/admin");
  }

  next();
});

router.afterEach(() => {
  (router.app as RootVueApp).loading = false;
});

export default router;
