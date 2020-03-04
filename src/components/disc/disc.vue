<template>
  <transition>
    <music-list :title="title" :bgImage="bgImage" :list="list"></music-list>
  </transition>
</template>

<script>
import MusicList from "../../components/singer/components/music-list";
import { mapGetters } from "vuex";
import { DiscList, ERR_OK } from "../../api/config";
import axios from "axios";
import { createSong } from "../../common/js/song";

export default {
  data() {
    return {
      list: []
    };
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(["disc"]),
    title() {
      return this.disc.username;
    },
    bgImage() {
      return this.disc.cover;
    }
  },
  created() {
    this._getDiscList();
  },
  methods: {
    //获取数据
    _getDiscList() {
      if (!this.disc.content_id) {
        this.$router.push("/recommend");
        return;
      }
      let DL = Object.assign({}, DiscList, {
        disstid: this.disc.content_id
      });
      axios
        .get("/disc/", {
          params: DL
        })
        .then(res => {
          if (res.data.code === ERR_OK) {
            console.log(res.data.cdlist[0].songlist);
            this.list = this._normalizeSongs(res.data.cdlist[0].songlist);
            console.log(this.list);
          }
        });
    },
    //处理数据
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        if (list) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>

<style scoped lang='stylus'>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>