<template>
  <div class="singer">
    <list-View :list="Singers" @select="selectSinger"></list-View>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import { commonParams, singerData, ERR_OK } from "../../api/config";
import Singer from "../../common/js/singer";
import ListView from "./components/listView";
//vuex提供的语法糖（vuex对数据的修改和获取都提供了一系列语法糖，否则需要手动写很多代码）
//mapMutations对mutations做一层封装
import { mapMutations } from "vuex";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  name: "singer",
  data() {
    return {
      Singers: []
    };
  },
  components: {
    ListView
  },
  created() {
    this._getSingerList();
  },
  methods: {
    //歌手详情页跳转路由设置
    selectSinger(singer) {
      //router编程式跳转接口
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      //实现一个对mutation的提交
      this.setSinger(singer);
    },
    //获取数据
    _getSingerList() {
      axios
        .get("/singer/", {
          params: singerData
        })
        .then(res => {
          if (res.data.code === ERR_OK) {
            this.Singers = this._normalizeSinger(res.data.data.list);
          }
        });
    },
    //处理数据（让数据根据热门和首字母分类）
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });

      //处理map，得出A~Z的有序列表
      let hot = [];
      let ret = [];
      //分类，分出热门和首字母开头的对象
      for (let i in map) {
        let val = map[i];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      //有序化首字母开头的对象,合并数据
      ret.sort((a, b) => {
        //charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    //对'SET_SINGER'做映射
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable';

.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>