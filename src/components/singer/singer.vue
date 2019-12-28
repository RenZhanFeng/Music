<template>
  <div class="singer">
    <list-View :list="Singers"></list-View>
  </div>
</template>

<script>
import axios from "axios";
import { commonParams, singerData, ERR_OK } from "../../api/config";
import Singer from "../../common/js/singer";
import ListView from "./components/listView";

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
    }
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
  overflow: hidden;
}
</style>