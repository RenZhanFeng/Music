<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getItemName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { searchResult, ERR_OK } from "../../../api/config";
import axios from "axios";
import { filterSinger } from "../../../common/js/song";


const TYPE_SINGER = "singer"; //用来区分是歌曲还是歌手

export default {
  data() {
    return {
      page: 1,
      result: []
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
  created() {
    this.search();
  },
  methods: {
    search() {
      axios
        .get("/search/", {
          params: searchResult(this.query, this.page, this.showSinger)
        })
        .then(res => {
          if (res.data.code === ERR_OK) {
            console.log(res.data.data);
            this.result = this._genResult(res.data.data);
            console.log(this.result);
          } else {
            console.log("获取数据失败");
          }
        });
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        ret = ret.concat(data.song.list);
      }
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
          return `${item.albumname}`
        //return `${item.albumname}-${filterSinger(item.singer)}`;
      }
    }
  },
  watch: {
    query() {
      this.search();
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
  background #000
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