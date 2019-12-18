<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <swiper :options="swiperOption">
          <!-- slides -->
          <swiper-slide v-for="item in ImageUrl" :key="item.id">
            <img class="siwper-img" :src="item.imgUrl" alt="img" />
          </swiper-slide>

          <!-- Optional controls -->
          <div class="swiper-pagination" slot="pagination"></div>
          <!-- <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>-->
          <!-- <div class="swiper-scrollbar" slot="scrollbar"></div> -->
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "recommend",
  data() {
    return {
      swiperOption: {
        pagination: ".swiper-pagination",
        loop: true,
        effect: "fade",
        speed:2000,
        autoplay: {
          delay: 2000
        }
      },
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
    swiper,
    swiperSlide
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

.siwper-img {
  width: 100%;
}
</style>