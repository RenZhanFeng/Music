<template>
  <div class="suggest" ref="wrapper">
    <ul class="suggest-list content">
      <li class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getItemName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title="上拉刷新" :styleis="false"></loading>
    </ul>
  </div>
</template>

<script>
import { searchResult, ERR_OK } from "../../../api/config";
import axios from "axios";
import { createSong2 } from "../../../common/js/song";
import BScroll from "better-scroll";
import Loading from "../../../base/loading/loading";

const TYPE_SINGER = "singer"; //用来区分是歌曲还是歌手

export default {
  data() {
    return {
      page: 1,
      result: [],

      hasMore: true
    };
  },
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  components: { Loading },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper);
    this.scroll.on("scrollEnd", () => {
      if (this.scroll.y <= this.scroll.maxScrollY + 50) {
        this.searchMore();
      }
    });
  },
  watch: {
    query() {
      this.search();
    }
  },
  methods: {
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      axios
        .get("/search/", {
          params: searchResult(this.query, this.page, this.showSinger)
        })
        .then(res => {
          if (res.data.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data.data));
            this._checkMore(res.data.data.song);
            console.log(this.result);
          }
        });
    },
    search() {
      this.scroll.scrollTo(this.$refs.wrapper, 0, 0);
      this.page = 1;
      this.hasMore = true;
      axios
        .get("/search/", {
          params: searchResult(this.query, this.page, this.showSinger)
        })
        .then(res => {
          if (res.data.code === ERR_OK) {
            console.log(res.data.data);
            this.result = this._genResult(res.data.data);
            this._checkMore(res.data.data.song);
            console.log(this.result);
          } else {
            console.log("获取数据失败");
          }
        });
    },
    _checkMore(data) {
      if (!data.list.length) {
        this.hasMore = false;
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida.singername && data.song.curpage === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.albumid && musicData.albummid) {
          ret.push(createSong2(musicData));
        }
      });
      return ret;
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getItemName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name} -- ${item.singer}`;
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../../common/stylus/variable';
@import '../../../common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;
}

.suggest-list {
  padding: 0 30px;
}

.suggest-item {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}

.name {
  flex: 1;
  font-size: $font-size-medium;
  color: $color-text-d;
  overflow: hidden;
}

.icon {
  flex: 0 0 30px;
  width: 30px;
  font-size: $font-size-medium;
  color: $color-text-d;
}

.text {
  no-wrap();
}
</style>