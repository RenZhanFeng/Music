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
          <img :src="currentSong.image" alt="img" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h1 class="subtitle" v-html="currentSong.singer"></h1>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" alt="img" class="image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>

          <div class="middle-r" ref="wrapper">
            <div class="lyric-wrapper content">
              <div v-if="SongL">
                <p
                  class="text"
                  v-for="(item,index) in SongL.lines"
                  :key="index"
                  ref="lyricLine"
                  :class="{'current':currentLineNum === index}"
                >{{item.txt}}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
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
          <img :src="currentSong.image" alt="img" />
        </div>
        <div class="textmini">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
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
      :src="SongUrl"
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
import { commonParams, songLyric, ERR_OK, getKey } from "../../api/config";
import axios from "axios";
import { createSong1 } from "../../common/js/song";
import { Base64 } from "js-base64";
import Lyric from "lyric-parser";
import BScroll from "better-scroll";

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0, //歌曲已播放的时间
      radius: 32,
      SongL: null, //歌词数据
      currentLineNum: 0, //当前歌词所在的行
      currentShow: "cd", //cd和歌词之间的切换
      playingLyric: "" ,//当前歌词所在的行的歌词
      SongUrl:''
    };
  },
  components: {
    ProgressBar,
    ProgressCircle,
    BScroll
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
    //歌手名字
    singerName() {
      let ret = [];
      if (!this.currentSong.singer) {
        return "";
      } else {
        for (let i = 0; i < this.currentSong.singer.length; i++) {
          ret.push(this.currentSong.singer[i].name);
        }
        return ret.join("/");
      }
    },
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
      return this.currentTime / this.currentSong.duration;
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
  created() {
    this.touch = {};
    //console.log(this.currentSong)
  },
  mounted() {},
  methods: {
    //歌曲音频
    getSong() {
      axios
        .get("/api/", {
          params: getKey(this.currentSong.mid)
        })
        .then(res => {
          if (res.data.code === ERR_OK && res.data.req_0.data.midurlinfo[0].purl) {
            this.SongUrl = `${this.currentSong.url}${res.data.req_0.data.midurlinfo[0].purl}`
          }else{
            console.log('没有获取到歌曲音频自动跳到下一首')
            this.next()
          }
        });
    },
    //获取歌词数据
    _getSongLyric() {
      let SL = Object.assign({}, songLyric, {
        songmid: this.currentSong.mid
      });
      axios
        .get("/songLyric/", {
          params: SL
        })
        .then(res => {
          if (res.data.code === ERR_OK) {
            //使用js-Base64库来解码数据
            //使用lyric-parser库来转换数据，转换成Lyric对象
            this.SongL = new Lyric(
              Base64.decode(res.data.lyric),
              this.handleLyric
            );
            if (this.playing) {
              this.SongL.play();
            }
            this.scroll = new BScroll(this.$refs.wrapper);
            //console.log(this.SongL);
          } else {
            return "没有歌词";
            console.log("没有歌词,或者获取失败");
          }
        })
        .catch(() => {
          this.SongL = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    //lineNum是播放的行数，txt是歌词
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.scroll.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.wrapper.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    //对Mutations的映射
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
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
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.SongL) {
        this.SongL.togglePlay();
      }
    },
    //修改currentIndex的值来实现下一首和上一首
    prev() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    next() {
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
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
      this.$refs.audio.currentTime = this.currentSong.duration * percent;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.SongL) {
        this.SongL.seek(this.$refs.audio.currentTime * 1000);
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
    },
    //当playList改变的时候也要让currentIndex一起改变，来保证currentSong的ID不变
    resetCurrentIndex(list) {
      //findIndex是ES6的语法
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
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
      if (this.SongL) {
        this.SongL.seek(0);
      }
    },
    //滑动切换显示歌词或者CD
    middleTouchStart(e) {
      this.touch.initiated = true;
      // 用来判断是否是一次移动
      // this.touch.moved = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      const touch = e.touches[0];
      // if (!this.touch.initiated) {
      //   return;
      // }
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      //避免滚动歌词的时候触发
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      // if (!this.touch.moved) {
      //   this.touch.moved = true;
      // }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offset = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      this.touch.percent = Math.abs(offset / window.innerWidth);
      this.$refs.wrapper.style.transform = `translate3d(${offset}px,0,0)`;
      this.$refs.wrapper.style.transition = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style.transition = 0;
    },
    middleTouchEnd(e) {
      // if (!this.touch.moved) {
      //   return;
      // }
      let offset;
      let opacity;
      const time = 500;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offset = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offset = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offset = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offset = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.wrapper.style.transform = `translate3d(${offset}px,0,0)`;
      this.$refs.wrapper.style.transition = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style.transition = `${time}ms`;
    }
  },
  watch: {
    //检测currentSong的变化，发生变化就调用audio的play方法播放音乐
    currentSong(oldSong, newSong) {
      this.getSong();
      //避免切换播放模式的时候也触发
      if (oldSong.id === newSong.id) {
        return;
      }
      if (this.SongL) {
        this.SongL.stop();
        this.currentTime = 0;
        this.currentLineNum = 0;
      }
      // this.$nextTick(() => {
      //   this.$refs.audio.play();
      //   this._getSongLyric();
      // });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audio.play();
        this._getSongLyric();
      }, 1000);
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

.textmini {
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

.middle-r {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lyric-wrapper {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}

.text {
  line-height: 32px;
  color: $color-text-l;
  font-size: $font-size-medium;
}

.current {
  color: $color-text;
}

.dot-wrapper {
  text-align: center;
  font-size: 0;
}

.dot {
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $color-text-l;
}

.active {
  width: 20px;
  border-radius: 5px;
  background: $color-text-ll;
}

.playing-lyric-wrapper {
  width: 80%;
  margin: 30px auto 0 auto;
  overflow: hidden;
  text-align: center;
}

.playing-lyric {
  height: 20px;
  line-height: 20px;
  font-size: $font-size-medium;
  color: $color-text-l;
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