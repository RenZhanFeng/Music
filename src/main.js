//项目的入口文件

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fastclick from "fastclick";
import './common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false;
fastclick.attach(document.body);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  //error: 'dist/error.png',
  loading: require('./common/image/default.png'),
  attempt: 1
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
