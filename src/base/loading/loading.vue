<template>
  <div :class="change" ref="loding">
    <div class="loading">
      <img src="./loading.gif" alt="img" />
      <p class="desc">{{title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "正在载入..."
    },
    styleis: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    change() {
      return !this.styleis ? "" : "loading-container";
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable';

.loading {
  width: 100%;
  text-align: center;
}

.desc {
  line-height: 20px;
  font-size: $font-size-small;
  color: $color-text-l;
}

img {
  width: 24px;
  height: 24px;
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>