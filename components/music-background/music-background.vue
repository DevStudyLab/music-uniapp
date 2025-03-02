<template>
    <view class="music-background" :id="containerId">
        <slot></slot>
    </view>
</template>

<script>
import { WaveConfig, initMusicWaves } from '@/static/wave-config.js';

export default {
    name: 'music-background',
    props: {
        containerId: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'waves'
        }
    },
    data() {
        return {
            waveController: null
        };
    },
    mounted() {
        // #ifdef H5
        this.$nextTick(() => {
            if (this.type === 'waves') {
                this.initWaves();
            }
        });
        // #endif
    },
    methods: {
        initWaves() {
            this.waveController = initMusicWaves(this.containerId);
        },
        setAudioEnabled(enabled) {
            if (this.waveController) {
                this.waveController.setAudioEnabled(enabled);
            }
        },
        updateWithAudioData(audioData) {
            if (this.waveController) {
                this.waveController.updateWithAudioData(audioData);
            }
        }
    },
    beforeDestroy() {
        // 清理资源
        this.waveController = null;
    }
};
</script>

<style lang="scss" scoped>
.music-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #f8f8f8;
    overflow: hidden;
}
</style>