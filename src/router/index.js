import Vue from "vue";
import VueRouter from "vue-router";
import Recommend from "../components/recommend/recommend";
import Rank from "../components/rank/rank";
import Search from "../components/search/search";
import Singer from "../components/singer/singer";
import SingerDetail from '../components/singer/singer-detail'
import Disc from '../components/disc/disc'
import rankDetail from '../components/rank/rank-detail'


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/recommend' //重定向，让初次进入网页的时候也能显示推荐页面且tab高亮
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [{  //二级路由
      path: ':id',
      component: Disc
    }]
  },
  {
    path: '/singer',
    component: Singer,
    children: [{  //二级路由
      path: ':id',
      component: SingerDetail
    }]
  },
  {
    path: '/rank',
    component: Rank,
    children: [{  //二级路由
      path: ':id',
      component: rankDetail
    }]
  },
  {
    path: '/search',
    component: Search
  }

];

const router = new VueRouter({
  routes
});

export default router;
