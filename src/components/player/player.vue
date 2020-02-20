<template>
  <div class="player" v-if="playlist.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img
            :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+currentSong.songInfo.album.mid+'.jpg?max_age=2592000'"
            alt="img"
          />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.songInfo.name"></h1>
          <h1 class="subtitle" v-html="currentSong.songInfo.singer[0].name"></h1>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img
                  :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+currentSong.songInfo.album.mid+'.jpg?max_age=2592000'"
                  alt="img"
                  class="image"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" :class="cdCls">
          <img
            :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+currentSong.songInfo.album.mid+'.jpg?max_age=2592000'"
            alt="img"
          />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.songInfo.name"></h2>
          <p class="desc" v-html="currentSong.songInfo.singer[0].name"></p>
        </div>
        <div class="control">
          <!-- .stop阻止冒泡 -->
          <i :class="miniIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- canplay和error是audio自带的事件 -->
    <!-- canplay是歌曲能播放的时候派发 -->
    <!-- error是歌曲能播放出错的时候派发 -->
    <audio
      :src="'https://isure.stream.qqmusic.qq.com/C400'+currentSong.songInfo.file.media_mid+'.m4a?guid=7212882319&vkey=94739E944E256CE70DC23B16CB474260911303FC3EBFD8442731B6C2AEAD072E9E0AFB1AE7F9545268EC0D67630AE58FC0108AB6E5104E3D&uin=7467&fromtag=66'"
      ref="audio"
      @canplay="ready"
      @error="error"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";

export default {
  data() {
    return {
      songReady: false
    };
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex"
    ]),
    //控制暂停播放的按钮切换
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    //控制圆盘专辑的转动跟随播放暂停
    cdCls() {
      return this.playing ? "play" : "play pause";
    }
  },
  methods: {
    //对Mutations的映射
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLATING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX"
    }),
    //收起和打开全屏播放器组件
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    //控制playing的取值
    togglePlaying() {
      this.setPlayingState(!this.playing);
    },
    //修改currentIndex的值来实现下一首和上一首
    prev() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    //当用户不能点击的时候添加disable样式
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    //专辑图片的弹出缩回动画
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      //使用create-keyframe-animation库创建动画
      let animation = {
        //设置每个百分比下的动画
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      //使用create-keyframe-animation的API
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style.transform = "";
    },
    //获取原始位置和缩放尺寸
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    }
  },
  watch: {
    //检测currentSong的变化，发生变化就调用audio的play方法播放音乐
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    //实现歌曲的暂停和播放
    playing(newPlaying) {
      const audio = this.$refs.audio;
      newPlaying ? audio.play() : audio.pause();
    }
  },
  created() {
    //console.log(encodeURIComponent("1600819"));
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.normal-player {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: $color-background;
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.6;
  filter: blur(20px);
}

.background img {
  width: 100%;
  height: 100%;
}

.top {
  position: relative;
  margin-bottom: 25px;
}

.back {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 50;
}

.icon-back {
  display: block;
  padding: 9px;
  font-size: $font-size-large-x;
  color: $color-theme;
  transform: rotate(-90deg);
}

.title {
  width: 70%;
  margin: 0 auto;
  line-height: 40px;
  text-align: center;
  no-wrap();
  font-size: $font-size-large;
  color: $color-text;
}

.subtitle {
  line-height: 20px;
  text-align: center;
  font-size: $font-size-medium;
  color: $color-text;
}

.middle {
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
}

.middle-l {
  display: inline-block;
  vertical-align: top;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 80%;
}

.cd-wrapper {
  position: absolute;
  left: 10%;
  top: 0;
  width: 80%;
  height: 100%;
}

.cd {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 10px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

&.play {
  animation: rotate 20s linear infinite;
}

&.pause {
  animation-play-state: paused;
}

.cd img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 10px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
}

.bottom {
  position: absolute;
  bottom: 50px;
  width: 100%;
}

.operators {
  display: flex;
  align-items: center;
}

.icon {
  flex: 1;
  color: $color-theme;
}

&.disable {
  color: $color-theme-d;
}

i {
  font-size: 30px;
}

.i-left {
  text-align: right;
}

.i-center {
  padding: 0 20px;
  text-align: center;
}

.i-center i {
  font-size: 40px;
}

.i-right {
  text-align: left;
}

// 迷你播放器样式
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
}

.icon {
  flex: 0 0 40px;
  width: 40px;
  padding: 0 10px 0 20px;
}

.icon img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  line-height: 20px;
  overflow: hidden;
}

.name {
  margin-bottom: 2px;
  no-wrap();
  font-size: $font-size-medium;
  color: $color-text;
}

.desc {
  no-wrap();
  font-size: $font-size-small;
  color: $color-text-d;
}

.control {
  flex: 0 0 30px;
  width: 30px;
  padding: 0 10px;
}

.icon-play-mini, .icon-pause-mini, .icon-playlist {
  font-size: 30px;
  color: $color-theme-d;
}

.disable {
  color: $color-theme-d;
}

// 动画效果
// 播放器打开和收起的动画
.normal-enter-active, .normal-leave-active {
  transition: all 0.4s;

  .top, .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}

.normal-enter, .normal-leave-to {
  opacity: 0;

  .top {
    transform: translate3d(0, -100px, 0);
  }

  .bottom {
    transform: translate3d(0, 100px, 0);
  }
}

// 专辑圆盘转动的动画
.play {
  animation: rotate 30s linear infinite;
}

.pause {
  animation-play-state: paused;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>