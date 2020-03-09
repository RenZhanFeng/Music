<template>
  <transition name="slide">
    <music-list :list="song" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
//vuex用来获取数据提供的语法糖
import { mapGetters } from "vuex";
import axios from "axios";
import { singerDetails, ERR_OK } from "../../api/config";
import MusicList from "./components/music-list";
import { createSong } from "../../common/js/song";

export default {
  name: "SingerDetail",
  components: { MusicList },
  data() {
    return {
      song: [],
      vkey:'' //歌曲链接的参数
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    this._getsingerDetail(this.singer.id);
    //console.log(this.singer)
  },
  methods: {
    //获取数据
    _getsingerDetail(singerId) {
      //判断是否有参数值传入，如果没有就返回上一级，以免用户刷新看不到数据
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }

      var singerDetail = Object.assign({}, singerDetails, {
        data: JSON.stringify({
          comm: { ct: 24, cv: 0 },
          singerSongList: {
            method: "GetSingerSongList",
            param: { order: 1, singerMid: singerId, begin: 0, num: 200 },
            module: "musichall.song_list_server"
          }
        })
      });
      axios
        .get("/api/", {
          params: singerDetail
        })
        .then(res => {
          if (res.data.code === ERR_OK) {
            // console.log(res.data.singerSongList.data.songList);
            this.song = this._normalizeSongs(
              res.data.singerSongList.data.songList
            );
            //console.log(this.song);
          }
        });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songInfo.id && musicData.songInfo.mid) {
          ret.push(createSong(musicData.songInfo,this.vkey));
        }
      });
      return ret;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>