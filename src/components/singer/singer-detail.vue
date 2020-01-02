<template>
    <div class="singer-detail">singer-detail</div>
</template>

<script>
export default {
  name: "SingerDetail"
};
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}


</style>