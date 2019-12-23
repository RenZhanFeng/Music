<template>
  <div class="songList">
    <ul>
      <li class="item" v-for="item in list" :key="item.content_id">
        <div class="icon">
          <img v-lazy="item.cover" alt="img" />
        </div>
        <div class="text">
          <h2 class="name">{{item.username}}</h2>
          <p class="desc">{{item.title}}</p>
        </div>
      </li>
    </ul>
    <div class="loading-container" v-show="!list.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Loading from "../../base/loading/loading";
export default {
  name: "SongList",
  props: {
    list: Array
  },
  components: {
    Loading
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable';

.item {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  padding: 0 20px 20px;
}

.icon {
  padding-right: 20px;
}

.icon img {
  width: 60px;
  height: 60px;
}

.text {
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // flex: 1;
  line-height: 20px;
  font-size: $font-size-medium;
}

.name {
  margin-bottom: 10px;
  color: $color-text;
}

.desc {
  color: $color-text-d;
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>