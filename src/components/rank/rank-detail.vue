<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :list="list" :rank="rank"></music-list>
  </transition>
</template>

<script>
import MusicList from "../../components/singer/components/music-list";
import { mapGetters } from "vuex";
import axios from "axios";
import { rankDetailList, ERR_OK } from "../../api/config";
import { param } from "../../common/js/jsonp";
import { createSong } from "../../common/js/song";

export default {
  data() {
    return {
      list: [],
      rank: true
    };
  },
  components: { MusicList },
  computed: {
    ...mapGetters(["topList"]),
    title() {
      return this.topList.title;
    },
    bgImage() {
      if (this.list.length) {
        return this.list[0].image;
      } else {
        return '';
      }
    }
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.topList.topId) {
        this.$router.push("/rank");
        return;
      }
      axios
        .get("/api/", {
          params: rankDetailList(this.topList.topId, this.topList.period)
        })
        .then(res => {
          if (res.data.code === ERR_OK) {
            this.list = this._normalizeSongs(res.data.detail.data.songInfoList);
            //console.log(this.list);
          } else {
            console.log("获取数据失败");
          }
        });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item;
        if (musicData.id && musicData.mid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>