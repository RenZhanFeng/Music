<template>
  <div class="song-list">
    <ul>
      <li v-for="item in list" :key="item.songInfo.id" class="item">
        <div class="content">
          <h2 class="name">{{item.songInfo.name}}</h2>
          <p class="desc">{{item.songInfo.singer[0].name}}·{{item.songInfo.album.name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  font-size: $font-size-medium;
}

.content {
  flex: 1;
  line-height: 20px;
  //overflow: hidden;
}

.name {
  no-wrap();
  color: $color-text;
}

.desc {
  no-wrap();
  margin-top: 4px;
  color: $color-text-d;
}
</style>
