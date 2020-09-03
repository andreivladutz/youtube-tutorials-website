import Vue from "vue";
import LazyLoadDir from "@/utils/lazyLoadDirective";
// eslint-disable-next-line
// @ts-ignore
import VueAgile from "vue-agile";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/scss/style.scss";

Vue.directive("lazyload", LazyLoadDir);
Vue.use(VueAgile);

Vue.config.productionTip = false;

export default new Vue({
  router,
  store,

  data() {
    return {
      loading: false,
    };
  },

  render: h => h(App),
}).$mount("#app");
