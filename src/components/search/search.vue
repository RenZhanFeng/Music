<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="wrapper">
      <div class="shortcut content">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKey" :key="item.mid" @click="addQuery(item.name)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>

        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import searchBox from "../../base/search-box/search-box";
import Suggest from "./suggest/suggest";
import { searchHotKye, ERR_OK } from "../../api/config";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import searchList from "../../base/search-list/search-list";
import Confirm from "../../base/confirm/confirm";
import BScroll from "better-scroll";
import { playlistMixin } from "../../common/js/mixin";

export default {
  mixins: [playlistMixin],
  name: "search",
  data() {
    return {
      hotKey: [],
      query: ""
    };
  },
  components: {
    searchBox,
    Suggest,
    searchList,
    Confirm
  },
  created() {
    this._getsearchHotKye();
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper);
  },
  computed: {
    ...mapGetters(["searchHistory"])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.scroll.refresh();
        }, 20);
      }
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length ? "60px" : "";
      this.$refs.wrapper.style.bottom = bottom;
      this.$refs.searchResult.style.bottom = bottom;
    },
    //把点击到的hotKey传到搜索框内
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    onQueryChange(query) {
      this.query = query;
    },
    //获取数据
    _getsearchHotKye() {
      axios.get("/api/", { params: searchHotKye }).then(res => {
        if (res.data.code === ERR_OK) {
          //console.log(res);
          this.hotKey = res.data.hotkey.data.track_info.slice(0, 15);
          //console.log(this.hotKey);
        } else {
          console.log("获取数据失败");
        }
      });
    },
    //在手机端滑动搜索列表的时候收起键盘
    blurInput() {
      this.$refs.searchBox.blur();
    },
    //搜索历史功能
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory",
      "clearSearchHistory"
    ])
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.search-box-wrapper {
  margin: 20px;
}

.shortcut-wrapper {
  position: fixed;
  top: 178px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}

.hot-key {
  margin: 0 20px 20px 20px;
}

.title {
  margin-bottom: 20px;
  font-size: $font-size-medium;
  color: $color-text-l;
}

.item {
  display: inline-block;
  padding: 5px 10px;
  margin: 0 20px 10px 0;
  border-radius: 20px;
  background: $color-highlight-background;
  font-size: $font-size-medium;
  color: $color-text-d;
}

.search-result {
  position: fixed;
  width: 100%;
  top: 178px;
  bottom: 0;
}

.search-history {
  position: relative;
  margin: 0 20px;
}

.search-history .title {
  display: flex;
  align-items: center;
  height: 40px;
  margin-bottom: 0;
  font-size: $font-size-medium;
  color: $color-text-l;
}

.search-history .text {
  flex: 1;
}

.search-history .clear {
  extend-click();
}

.search-history .icon-clear {
  font-size: $font-size-medium;
  color: $color-text-d;
}
</style>