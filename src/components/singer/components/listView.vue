<template>
  <div class="singer" ref="wrapper">
    <ul class="content">
      <li class="title" v-for="item in list" :key="item.id" ref="listGroup">
        <h2>{{item.title}}</h2>
        <ul>
          <li class="items" v-for="item in item.items" :key="item.id" @click="selectItem(item)">
            <img class="items-img" v-lazy="item.avatar" alt="img" />
            <span class="items-name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- @touchstart='' 屏幕触摸事件 prevent:防止事件冒泡和浏览器的原生滚动-->
    <div
      class="list-shoortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
        >{{item}}</li>
      </ul>
    </div>
    <loading v-show="!list.length"></loading>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
import Loading from "../../../base/loading/loading";
import { getData, addClass } from "../../../common/js/dom";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  name: "singer",
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      touch: {},
      scrollY: -1,
      currentIndex: 0
    };
  },
  components: {
    Loading
  },
  mounted() {
    this.scroll = new Bscroll(this.$refs.wrapper);
  },
  computed: {
    //获取Findex的值
    shortcutList() {
      return this.list.map(group => {
        return group.title.substr(0, 1);
      });
    }
  },
  methods: {
    selectItem(item){
      this.$emit('select',item)
    },
    onShortcutTouchStart(e) {
      //anchor:锚点
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.anchorIndex = anchorIndex;
      this.touch.y1 = firstTouch.pageY;
      this.scroll.scrollToElement(this.$refs.listGroup[anchorIndex]);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      //18是每一个项的高度
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / 18);
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      //后面的参数1000表示列表滚动的时间
      this.scroll.scrollToElement(this.$refs.listGroup[anchorIndex], 1000);
    },
    scroll() {}
  }
};
</script>

<style scoped lang="stylus">
@import '../../../common/stylus/variable';

.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}

.items {
  display: flex;
  align-items: center;
  padding: 20px 0 0 30px;
}

.items-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.items-name {
  margin-left: 20px;
  color: $color-text-l;
  font-size: $font-size-medium;
}

.title {
  padding-bottom: 20px;
}

.title h2 {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  color: $color-text-l;
  font-size: $font-size-small;
  background: $color-highlight-background;
}

.list-shoortcut {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-background-d;
  font-family: Helvetica;
}

.list-shoortcut .item {
  padding: 3px;
  line-height: 1;
  color: $color-text-l;
  font-size: $font-size-small;
}

.text {
  color: $color-theme;
  font-size: $font-size-large;
}
</style>