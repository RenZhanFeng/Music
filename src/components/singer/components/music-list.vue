<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 因为可能会有转义字符所以使用v-html -->
    <h1 class="title" v-html="title" ref="title"></h1>

    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="list.length>0" @click="random" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>

    <div class="bg-layer" ref="layer"></div>
    <!--@scroll="scrolls"无效！！！  -->
    <div class="wrapper" ref="list">
      <div class="song-list-wrapper content">
        <song-list :list="list" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!list.length">
        <loading></loading>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import Loading from "../../../base/loading/loading";
import SongList from "../../../base/song-list/song-list";
import { mapActions } from "vuex";
import { playlistMixin } from "../../../common/js/mixin";
export default {
  mixins: [playlistMixin],
  props: {
    list: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  components: {
    SongList,
    Loading
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.list.style.bottom = bottom
    },
    back() {
      this.$router.back();
    },

    scrolls(e) {
      this.scrollY = e.y;
    },
    selectItem(item, index) {
      console.log(index);
      console.log(item);
      this.selectPlay({
        list: this.list,
        index
      });
    },
    //随机随机播放全部功能
    random() {
      this.randomPlay({
        list: this.list
      });
    },
    ...mapActions(["selectPlay", "randomPlay"])
  },
  watch: {
    scrollY(newY) {
      let tranlateY = Math.max(this.minTranslateY, newY); //返回两个值之中最大的一个值
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      this.$refs.layer.style.transform = `translate3d(0,${tranlateY}px,0)`;
      this.$refs.layer.style[
        "webkitTransform"
      ] = `translate3d(0,${tranlateY}px,0)`;

      const percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        //给ios手机做上拉时背景图高斯模糊效果，安卓手机和电脑浏览器不支持
        blur = Math.min(20 * percent, 20);
      }
      //给ios手机做上拉时背景图高斯模糊效果，安卓手机和电脑浏览器不支持
      this.$refs.filter.style["backdrop-filter"] = `blur(${blur}px)`;
      this.$refs.filter.style["webkitBackdrop-filter"] = `blur(${blur}px)`;
      if (newY < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = this.$refs.title.clientHeight + "px";
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style.transform = `scale(${scale})`;
      this.$refs.bgImage.style["webkitTransform"] = `scale(${scale})`;
    }
  },
  created() {},
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + this.$refs.title.clientHeight;
    this.$refs.list.style.top = `${this.$refs.bgImage.clientHeight}px`;
    let wrapper = document.querySelector(".wrapper");
    this.scroll = new BScroll(wrapper, {
      probeType: 3
    });
    //触发滚动事件
    this.scroll.on("scroll", this.scrolls);
  }
};
</script>

<style lang="stylus" scoped>
@import '../../../common/stylus/variable';
@import '../../../common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}

.back {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 50;
}

.icon-back {
  display: block;
  padding: 10px;
  font-size: $font-size-large-x;
  color: $color-theme;
}

.title {
  position: absolute;
  top: 0;
  left: 10%;
  z-index: 40;
  width: 80%;
  text-align: center;
  line-height: 40px;
  font-size: $font-size-large;
  color: $color-text;
  no-wrap();
}

.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
  transform-origin: top;
  background-size: cover;
}

.filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.4);
}

.play-wrapper {
  position: absolute;
  bottom: 20px;
  z-index: 50;
  width: 100%;
}

.play {
  box-sizing: border-box;
  width: 135px;
  padding: 7px 0;
  margin: 0 auto;
  text-align: center;
  color: $color-theme;
  font-size: $font-size-small;
  border: 1px solid $color-theme;
  border-radius: 100px;
}

.icon-play {
  vertical-align: middle;
  margin-right: 6px;
  font-size: $font-size-medium-x;
}

.text {
  vertical-align: middle;
  font-size: $font-size-small;
}

.song-list-wrapper {
  padding: 20px 30px;
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  // overflow: auto;
  background: $color-background;
}

.bg-layer {
  position: relative;
  height: 100%;
  background: $color-background;
}
</style>
