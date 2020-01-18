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

export default {
  name: "SingerDetail",
  components: { MusicList },
  data() {
    return {
      song: []
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
            this.song = res.data.singerSongList.data.songList;
          }
        });
    }
  }
};
// "002zfxmN2e1vLQ"
// `http://ws.stream.qqmusic.qq.com/"002zfxmN2e1vLQ".m4a?fromtag=46`
// http://113.96.98.150/amobile.music.tc.qq.com/C400001Qu4I30eVFYb.m4a?guid=1634402707&vkey=43BB997F1D0895C06B20B502786030A4A7DF0C2BFA2CF50AA98B862C0E8D5E9808DF269168C6E7B4B2A0607B129C502660E304652F56CDB9&uin=0&fromtag=66
// http://113.96.98.150/amobile.music.tc.qq.com/C400003mBrF72dILfK.m4a?guid=1634402707&vkey=7D88E044FC0FF17ECED75D3B8816AE934E5B265CF8CCAADA4ECF0A2434E63D5342A091DADC12E09222A7715CC781F531DCFB43FEA32F1E4C&uin=0&fromtag=66
// 专辑图片：
// `//y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg?max_age=2592000`
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>

