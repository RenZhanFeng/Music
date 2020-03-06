<template>
  <div class="rank" ref="rank">
    <div class="toplist" ref="wrapper">
      <ul class="content">
        <li class="item" v-for="item in topList" :key="item.topId" @click="selectItem(item)">
          <div class="icon">
            <img :src="item.frontPicUrl" alt="img" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.song" :key="song.title">
              <span>{{index +1}}.</span>
              <span>{{song.title}}--{{song.singerName}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <loading v-show="!topList.length"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
import { rankTopList, ERR_OK } from "../../api/config";
import BScroll from "better-scroll";
import Loading from "../../base/loading/loading";
import { playlistMixin } from "../../common/js/mixin";
import { mapMutations } from "vuex";
export default {
  mixins: [playlistMixin],
  name: "rank",
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getRankList();
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper);
  },
  methods: {
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    }),
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.topId}`
      });
      this.setTopList(item)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length ? "60px" : "";
      this.$refs.rank.style.bottom = bottom;
    },
    //获取数据
    _getRankList() {
      axios.get("/api/", { params: rankTopList }).then(res => {
        if (res.data.code === ERR_OK) {
          let all = res.data.toplist.data.group;
          for (let i in all) {
            for (let j in all[i].toplist) {
              this.topList.push(all[i].toplist[j]);
            }
          }
         //console.log(this.topList);
        } else {
          console.log("获取数据失败");
        }
      });
    }
  },
  components: { Loading }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 0;
}

.toplist {
  height: 100%;
  overflow: hidden;
}

.item {
  display: flex;
  margin: 0 20px;
  padding-top: 20px;
  height: 100px;
}

.item:last-child {
  padding-bottom: 20px;
}

.icon {
  flex: 0 0 100px;
  width: 100px;
  height: 100px;
}

.icon img {
  width: 100px;
  height: 100px;
}

.songlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  height: 100px;
  overflow: hidden;
  background: $color-highlight-background;
  color: $color-text-d;
  font-size: $font-size-small;
}

.song {
  no-wrap();
  line-height: 26px;
}
</style>