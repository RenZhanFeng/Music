<template>
  <div class="wrapper">
    <swiper :options="swiperOption">
      <!-- slides -->
      <swiper-slide v-for="item in list" :key="item.id">
        <a
          :href="'https://y.qq.com/n/yqq/album/'+item.jump_info.url+'.html#stat=y_new.index.focus.click'"
        >
          <img class="siwper-img" :src="item.pic_info.url" alt="img" />
        </a>
      </swiper-slide>

      <!-- Optional controls -->
      <div class="swiper-pagination" slot="pagination"></div>
      <!-- <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>-->
      <!-- <div class="swiper-scrollbar" slot="scrollbar"></div> -->
    </swiper>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "Swiper",
  props: {
    list: Array
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        },
        effect: "fade",
        speed: 2000,
        autoplay: {
          loop: true,
          delay: 2000
        }
      },
      
    };
  },
  components: {
    swiper,
    swiperSlide
  }
};
</script>

<style scoped lang="stylus">
@import '../../../common/stylus/variable';

.wrapper >>>.swiper-pagination-bullet-active {
  background: hsla(0, 0%, 100%, 0.5);
}

.siwper-img {
  width: 100%;
}
</style>