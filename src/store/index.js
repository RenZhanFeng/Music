// Vuex入口文件

import Vue from "vue";
import Vuex from "vuex";
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
//vuex提供的插件
//每当mutation修改state的时候都会在控制台打印Log
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

//调试工具，帮忙检测对state的修改是不是来自于mutations,
//在开发的时候debug为true，打开严格模式，上线的时候则相反
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
