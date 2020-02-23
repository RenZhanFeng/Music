<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div
          class="progress-btn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend.prevent="progressTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16;

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    //用于不同的touch事件里面共享数据
    this.touch = {};
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX; //点击的横坐标
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      //偏移值不能小于0大于bar的长度
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick(e) {
      this._offset(e.offsetX);
      this._triggerPercent();
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent);
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
    }
  },
  watch: {
    //实现进度条跟随音乐进度移动
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this._offset(offsetWidth);
      }
    }
  }
};
</script>

<style scoped lang='stylus'>
@import '../../common/stylus/variable';

.progress-bar {
  height: 30px;
}

.bar-inner {
  position: relative;
  top: 13px;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
}

.progress {
  position: absolute;
  height: 100%;
  background: $color-theme;
}

.progress-btn-wrapper {
  position: absolute;
  left: -8px;
  top: -13px;
  width: 30px;
  height: 30px;
}

.progress-btn {
  position: relative;
  top: 7px;
  left: 7px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border: 3px solid $color-text;
  border-radius: 50%;
  background: $color-theme;
  transform: translate3d(0, 0, 0);
}
</style>