<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <swiper :list="recommends"></swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { getDiscList, getRecommend } from "../../api/recommend";
import { ERR_OK } from "../../api/config";
import Swiper from "./Swiper";

export default {
  name: "recommend",
  data() {
    return {
      recommends:[]
    };
  },
  components: {
    Swiper
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === 0) {
          this.recommends = res.focus.data.content;
        }
        window.console.log(res.focus.data.content);
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
        //window.console.log(res.data);
      });
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}

.recommend-content {
  height: 100%;
  overflow: hidden;
}

.slider-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}
</style>