<template>
  <view class="wave-background" :id="containerId">
    <view class="wave wave1"></view>
    <view class="wave wave2"></view>
    <view class="wave wave3"></view>
    <view class="wave wave4"></view>
    <view class="wave wave5"></view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'music-background-new',
  props: {
    containerId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'waves'
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
  background: linear-gradient(135deg, #2979ff 0%, #1565c0 50%, #0d47a1 100%);
  overflow: hidden;
}

.wave {
  position: absolute;
  left: -100%;
  width: 200%;
  height: 100%;
  background: transparent;
  transform-origin: 50% 50%;

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
  animation: wave 12s cubic-bezier(0.36, 0, 0.64, 1) infinite;
  z-index: 1;
  opacity: 0.5;
  animation-delay: 0s;
  top: 30%;

  &::before {
    animation: rotate 12s linear infinite;
  }
}

.wave2 {
  animation: wave 16s cubic-bezier(0.36, 0, 0.64, 1) infinite;
  z-index: 2;
  opacity: 0.4;
  animation-delay: -5s;
  top: 35%;

  &::before {
    animation: rotate 16s linear infinite;
  }
}

.wave3 {
  animation: wave 20s cubic-bezier(0.36, 0, 0.64, 1) infinite;
  z-index: 3;
  opacity: 0.3;
  animation-delay: -2s;
  top: 40%;

  &::before {
    animation: rotate 20s linear infinite;
  }
}

.wave4 {
  animation: wave 25s cubic-bezier(0.36, 0, 0.64, 1) infinite;
  z-index: 4;
  opacity: 0.2;
  animation-delay: -7s;
  top: 45%;

  &::before {
    animation: rotate 25s linear infinite;
  }
}

.wave5 {
  animation: wave 30s cubic-bezier(0.36, 0, 0.64, 1) infinite;
  z-index: 5;
  opacity: 0.1;
  animation-delay: -10s;
  top: 50%;

  &::before {
    animation: rotate 30s linear infinite;
  }
}

@keyframes wave {
  0% {
    transform: translateX(0) scale(1.2);
  }
  50% {
    transform: translateX(25%) scale(1);
  }
  100% {
    transform: translateX(50%) scale(1.2);
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