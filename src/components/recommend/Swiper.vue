<template>
  <div class="wrapper">
    <swiper :options="swiperOption">
      <!-- slides -->
      <swiper-slide v-for="item in list" :key="item.id">
        <img class="siwper-img" :src="item.imgUrl" alt="img" />
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
  props:{
      list:Array
  },
  data() {
    return {
      swiperOption: {
        pagination: ".swiper-pagination",
        loop: true,
        effect: "fade",
        speed: 2000,
        autoplay: {
          delay: 2000
        }
      }
      
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

.siwper-img {
  width: 100%;
}
</style>