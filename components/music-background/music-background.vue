<template>
  <view class="wave-background" :id="containerId">
    <view class="wave wave1"></view>
    <view class="wave wave2"></view>
    <view class="wave wave3"></view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'music-background',
  props: {
    containerId: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.wave-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(to bottom, #2979ff 0%, #f8f8f8 100%);
  overflow: hidden;
}

.wave {
  position: absolute;
  left: -100%;
  width: 200%;
  height: 100%;
  background: transparent;
  opacity: 0.4;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 200%;
    background: #fff;
    border-radius: 50%;
    transform: translate(0, -50%);
  }
}

.wave1 {
  animation: wave 12s linear infinite;
  z-index: 1;
  opacity: 0.3;
  animation-delay: 0s;
  top: 40%;

  &::before {
    animation: rotate 12s linear infinite;
  }
}

.wave2 {
  animation: wave 16s linear infinite;
  z-index: 2;
  opacity: 0.2;
  animation-delay: -5s;
  top: 45%;

  &::before {
    animation: rotate 16s linear infinite;
  }
}

.wave3 {
  animation: wave 20s linear infinite;
  z-index: 3;
  opacity: 0.1;
  animation-delay: -2s;
  top: 50%;

  &::before {
    animation: rotate 20s linear infinite;
  }
}

@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(50%);
  }
}

@keyframes rotate {
  0% {
    transform: translate(0, -50%) rotate(0);
  }
  100% {
    transform: translate(0, -50%) rotate(360deg);
  }
}
</style>