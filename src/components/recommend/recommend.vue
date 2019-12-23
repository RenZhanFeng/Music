<template>
  <div class="recommend">
    <div class="recommend-content wrapper">
      <div class="content">
        <div class="slider-wrapper">
          <swiper :list="Swiper"></swiper>
        </div>

        <div class="song-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <song-list :list="SongList"></song-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend } from "../../api/recommend";
import { ERR_OK } from "../../api/config";
import Swiper from "./Swiper";
import SongList from "./SongList";
import BScroll from "better-scroll";


export default {
  name: "recommend",
  components: {
    Swiper,
    SongList
  },
  data() {
    return {
      Swiper: [],
      SongList: []
    };
  },
  mounted() {
    let wrapper = document.querySelector(".wrapper");
    let scroll = new BScroll(wrapper);
  },
  created() {
    this._getRecommend()
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === 0) {
          this.Swiper = res.focus.data.content;
          this.SongList = res.recomPlaylist.data.v_hot;
        }
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

.list-title {
  height: 65px;
  line-height: 65px;
  text-align: center;
  font-size: $font-size-medium;
  color: $color-theme;
}


</style>