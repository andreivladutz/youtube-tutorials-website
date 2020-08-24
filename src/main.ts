import Vue from "vue";
// eslint-disable-next-line
// @ts-ignore
import VueAgile from "vue-agile";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/scss/style.scss";

Vue.use(VueAgile);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
