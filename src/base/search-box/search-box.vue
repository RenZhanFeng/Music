<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" ref="query" v-model="query" :placeholder="placeholder" />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from "../../common/js/util";

export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  created() {
    //在created使用回调的方式传出数据而不直接在watch:{}中传出的原因
    //debounce防抖优化
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("query", newQuery);
      }, 200)
    );
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    },
    blur(){
      this.$refs.query.blur()
    }
  }
};
</script>

<style scoped lang='stylus'>
@import '../../common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 50px;
}

.icon-search {
  font-size: 24px;
  color: $color-background;
}

.box {
  flex: 1;
  margin: 0 5px;
  line-height: 18px;
  outline: none;
  background: $color-highlight-background;
  color: $color-text;
  font-size: $font-size-medium;
}

.box::placeholder {
  color: $color-text-d;
}

.icon-dismiss {
  font-size: 16px;
  color: $color-background;
  margin-right: 10px;
}
</style>