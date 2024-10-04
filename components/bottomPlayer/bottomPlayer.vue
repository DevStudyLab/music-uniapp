<template>
	<view>

		<view class="musicPlayer" @click="playerHandler">
			<image class="playerImg" src="../../static/player.jpeg"></image>
			<view class="rightText">
				<view v-if="!isStart" class="iconfont icon-kaishibofang" @click.stop="musicPlayer"></view>
				<view v-else class="iconfont icon-zantingbofang" @click.stop="musicPlayer"></view>
				<p v-if="name">{{name}}-{{singer}}</p>
				<p v-else>开始你的音乐之旅</p>
			</view>
		</view>

		<uni-popup class="player" ref="player" backgroundColor="#fff">
			<view class="popup-content">
				<uni-nav-bar v-if="isComment===false" dark fixed background-color="#2979ff" status-bar
					left-icon="bottom" @clickLeft="back" right-icon='chat' @clickRight="isComment = true" />
				<uni-nav-bar v-else dark fixed background-color="#2979ff" status-bar left-icon="bottom"
					@clickLeft="back" right-icon='undo' @clickRight="isComment = false" />
				<view v-if="isComment===false">
					<view class="topInfo">
						<image class="playerImg" src="../../static/player.jpeg"></image>
						<text class="name"><strong>{{name}}</strong></text>
						<text>{{singer}}</text>
						<scroll-view scroll-y="true">
							<view>暂无歌词</view>
							<view>暂无歌词</view>
							<view>暂无歌词</view>
							<view>暂无歌词</view>
							<view>暂无歌词</view>
							<view>暂无歌词</view>
							<view>暂无歌词</view>
							<view>暂无歌词</view>
							<view>暂无歌词</view>
							<view>暂无歌词</view>
						</scroll-view>
					</view>
					<view class="playerOption">
						<view class="iconfont icon-shangyishou_huaban" />
						<view v-if="!isStart" class="iconfont icon-kaishibofang" @click="musicPlayer" />
						<view v-else class="iconfont icon-zantingbofang" @click="musicPlayer" />
						<view class="iconfont icon-xiayishou_huaban" />
					</view>
				</view>
				<view v-else>
					<scroll-view scroll-y="true" style="height: 93vh;">
						<recursiveComment class="recursiveComment" :id="id" />
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		addBase
	} from '../../utils/myFunction';
	import request from '../../utils/request';
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		name: "bottomPlayer",
		props: ['id', 'name', 'singer', 'content'],
		data() {
			return {
				isStart: false,
				isComment: false,
				commentList: []
			};
		},
		watch: {
			name(newVal, oldVal) {
				innerAudioContext.src = addBase(this.content)
				innerAudioContext.play()
				this.isStart = true
			}
		},
		methods: {
			playerHandler() {
				this.$refs.player.open('bottom')
				this.isComment = false
			},
			back() {
				this.$refs.player.close()
			},
			musicPlayer() {
				if (this.isStart) {
					innerAudioContext.pause()
					this.isStart = false
				} else {
					innerAudioContext.play()
					this.isStart = true
				}
			},
		}
	}
</script>

<style lang="scss">
	.recursiveComment {
		padding-bottom: 120upx;
	}

	.musicPlayer {
		border-top: 1px solid #ccc;
		width: 100%;
		height: 100upx;
		display: flex;
		background-color: #fff;
		opacity: 0.9;

		.playerImg {
			margin: 10upx;
			height: 80upx;
			width: 80upx;
			border-radius: 50%;
		}

		.rightText {
			height: 100%;
			width: calc(100% - 100upx);
			line-height: 100upx;

			p {
				margin-left: 10upx;
				font-size: 30upx;
			}

			.icon-kaishibofang,
			.icon-zantingbofang {
				float: right;
				margin-right: 20upx;
			}
		}
	}

	.player {

		.popup-content {
			height: 100vh;
		}

		.topInfo {
			display: flex;
			align-items: center;
			flex-direction: column;

			.playerImg {
				margin-top: 100upx;
				height: 300upx;
				width: 300upx;
				border-radius: 50%;
			}

			text {
				margin-top: 20upx;
				font-size: 30upx;
			}

			.name {
				margin-top: 60upx;
				font-size: 50upx;
			}

			scroll-view {
				margin-top: 20upx;
				text-align: center;
				height: 300upx;

			}
		}


		.playerOption {
			margin: 50upx 150upx 0 150upx;
			display: flex;
			justify-content: space-between;

			.iconfont {
				font-size: 60upx;
			}
		}
	}
</style>