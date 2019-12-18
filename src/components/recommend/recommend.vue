<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <swiper :list="ImageUrl"></swiper>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from "./Swiper";

export default {
  name: "recommend",
  data() {
    return {
      ImageUrl: [
        {
          id: "0001",
          imgUrl:
            "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1911779.jpg"
        },
        {
          id: "0002",
          imgUrl:
            "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1911780.jpg"
        },
        {
          id: "0003",
          imgUrl:
            "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1911570.jpeg"
        },
        {
          id: "0004",
          imgUrl:
            "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1911563.jpg"
        },
        {
          id: "0005",
          imgUrl:
            "http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1911001.jpg"
        }
      ]
    };
  },
  components: {
    Swiper
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