import Vue from "vue";
import LazyLoadDir from "@/utils/lazyLoadDirective";
import ThumbnailDir from "@/utils/thumbnailDirective";

// eslint-disable-next-line
// @ts-ignore
import VueAgile from "vue-agile";
import LoadingIndicator from "@/components/tools/LoadingIndicator.vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/scss/style.scss";
//import "element-ui/lib/theme-chalk/index.css";

Vue.directive("lazyload", LazyLoadDir);
Vue.directive("thumbnail", ThumbnailDir);
Vue.component("LoadingIndicator", LoadingIndicator);
Vue.use(VueAgile);

Vue.config.productionTip = false;
Vue.prototype.$ELEMENT = { size: "large", zIndex: 3000 };

export interface RootVueApp extends Vue {
  loading: boolean;
  // The light theme is activated or the dark theme is
  isLightTheme: boolean;
  // Whether to show the theme toggle button or not
  showThemeToggle: boolean;
}

export default new Vue({
  router,
  store,

  data() {
    return {
      loading: false,
      isLightTheme: false,
      showThemeToggle: true,
    };
  },

  render: h => h(App),
}).$mount("#app");
