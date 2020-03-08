<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKey" :key="item.mid" @click="addQuery(item.name)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
import searchBox from "../../base/search-box/search-box";
import Suggest from "./suggest/suggest";
import { searchHotKye, ERR_OK } from "../../api/config";
import axios from "axios";

export default {
  name: "search",
  data() {
    return {
      hotKey: [],
      query: ""
    };
  },
  components: {
    searchBox,
    Suggest
  },
  created() {
    this._getsearchHotKye();
  },
  methods: {
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
    }
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
}

.shortcut {
  height: 100%;
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
</style>