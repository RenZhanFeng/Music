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
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.songInfo.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
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
          <!-- 传固定的值就不需要加： -->
          <progress-circle :radius="radius" :percent="percent">
            <!-- .stop阻止冒泡 -->
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- audio自带的事件:
    canplay是歌曲能播放的时候派发
    error是歌曲能播放出错的时候派发
    timeupdate是歌曲播放过程派发
    ended是歌曲播放结束时派发-->
    <audio
      :src="'https://isure.stream.qqmusic.qq.com/C400'+currentSong.songInfo.file.media_mid+'.m4a?guid=7212882319&vkey='+'BBB40C8A90C81410AEC73011D347DF2058B008D3BC9D2530896DA95DB61EC1E0C4FAFDD19010E1E0D7D5EBD8593397B4088617926C89B44C'+'&uin=7467&fromtag=66'"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import ProgressBar from "../../base/progress-bar/progress-bar";
import ProgressCircle from "../../base/progress-circle/progress-circle";
import { playMode } from "../../common/js/config";
import { shuffle } from "../../common/js/util";

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0, //歌曲已播放的时间
      radius: 32,

    };
  },
  components: {
    ProgressBar,
    ProgressCircle
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
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
    },
    percent() {
      return this.currentTime / this.currentSong.songInfo.interval;
    },
    //播放模式切换
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    }
  },
  methods: {
    //对Mutations的映射
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLATING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayist: "SET_PLAYLIST"
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
    //获取歌曲已播放的时间
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      interval = interval | 0; //向下取整，相当于调用Math.floor
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    onProgressBarChange(percent) {
      this.$refs.audio.currentTime =
        this.currentSong.songInfo.interval * percent;
      if (!this.playing) {
        this.togglePlaying();
      }
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
    },
    //点击修改播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      //根据播放模式修改播放列表
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayist(list);
      console.log(this.currentSong);
    },
    //当playList改变的时候也要让currentIndex一起改变，来保证currentSong的ID不变
    resetCurrentIndex(list) {
      //findIndex是ES6的语法
      let index = list.findIndex(item => {
        return item.songInfo.id === this.currentSong.songInfo.id;
      });
      this.setCurrentIndex(index);
    },
    //当一首歌播放结束时，自动切换到下一首
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    //循环播放模式
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    }
  },
  watch: {
    //检测currentSong的变化，发生变化就调用audio的play方法播放音乐
    currentSong(oldSong, newSong) {
      //避免切换播放模式的时候也触发
      //关闭原因：三层表达式访问数据报错，vuex中state管理加载的数据，
      //异步调用显示，然后vue渲染机制中：异步数据先显示初始数据，再显示带数据的数据， 

      // if (oldSong.songInfo.id === newSong.songInfo.id) {
      //   return;
      // }
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    //实现歌曲的暂停和播放
    playing(newPlaying) {
      const audio = this.$refs.audio;
      newPlaying ? audio.play() : audio.pause();
    }
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

.operators .icon {
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

.icon-mini {
  font-size: 32px;
  position: absolute;
  left: 0;
  top: 0;
}

.disable {
  color: $color-theme-d;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0px auto;
  padding: 10px 0;
}

.time {
  color: $color-text;
  font-size: $font-size-small;
  flex: 0 0 30px;
  line-height: 30px;
  width: 30px;
}

.time-l {
  text-align: left;
}

.time-r {
  text-align: right;
}

.progress-bar-wrapper {
  flex: 1;
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