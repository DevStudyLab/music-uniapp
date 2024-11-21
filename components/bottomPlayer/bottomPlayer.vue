<template>
	<view>

		<view class="musicPlayer" @click="playerHandler">
			<image class="playerImg" src="../../static/player.jpeg"></image>
			<view class="rightText">
				<p v-if="name">{{ name }}-{{ singer }}</p>
				<p v-else>开始你的音乐之旅</p>
				<view v-if="!isStart" class="iconfont icon-kaishibofang" @click.stop="musicPlayer"></view>
				<view v-else class="iconfont icon-zantingbofang" @click.stop="musicPlayer"></view>
			</view>
		</view>

		<uni-popup class="player" ref="player" backgroundColor="#fff">
			<view class="popup-content">
				<uni-nav-bar v-if="isComment === false" :title="name" dark fixed background-color="#2979ff" status-bar
					left-icon="bottom" @clickLeft="back" right-icon='chat' @clickRight="isComment = true" />
				<uni-nav-bar v-else :title="name" dark fixed background-color="#2979ff" status-bar left-icon="bottom"
					@clickLeft="back" right-icon='undo' @clickRight="isComment = false" />
				<view v-if="isComment === false">
					<view class="topInfo">
						<image class="playerImg" :class="{ 'rotating': isStart }" src="../../static/player.jpeg">
						</image>
						<text class="name"><strong>{{ name }}</strong></text>
						<text>{{ singer }}</text>
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
						<view class="progress-bar">
							<text class="time">{{ currentTime }}</text>
							<view class="progress-wrapper">
								<view class="progress-inner" :style="{ width: progress + '%' }">
									<view class="progress-dot"></view>
								</view>
							</view>
							<text class="time">{{ duration }}</text>
						</view>
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
				commentList: [],
				progress: 0,
				currentTime: '00:00',
				duration: '00:00',
			};
		},
		watch: {
			name(newVal, oldVal) {
				innerAudioContext.src = addBase(this.content)
				innerAudioContext.play()
				this.isStart = true
			}
		},
		mounted() {
			innerAudioContext.onTimeUpdate(() => {
				const current = innerAudioContext.currentTime
				const duration = innerAudioContext.duration
				this.progress = (current / duration) * 100
				this.currentTime = this.formatTime(current)
				this.duration = this.formatTime(duration)
			})
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
			formatTime(time) {
				const minutes = Math.floor(time / 60)
				const seconds = Math.floor(time % 60)
				return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
			},
		}
	}
</script>

<style lang="scss">
	.recursiveComment {
		padding-bottom: 120upx;
	}

	.musicPlayer {
		border-top: 2upx solid #f0f0f0;
		width: 100%;
		height: 100upx;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(10upx);

		.playerImg {
			width: 80upx;
			height: 80upx;
			margin: 10upx;
			border-radius: 50%;
			box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.1);
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.95);
			}
		}

		.rightText {
			flex: 1;
			height: 100%;
			display: flex;
			align-items: center;
			padding: 0 20upx;

			p {
				font-size: 28upx;
				color: #333;
				margin: 0;
				padding: 0;
				line-height: 1.4;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.icon-kaishibofang,
		.icon-zantingbofang {
			font-size: 48upx;
			color: #2979ff;
			padding: 10upx 20upx;
			transition: all 0.3s ease;
			margin-left: auto;
			display: flex;
			align-items: center;

			&:active {
				transform: scale(0.9);
				color: #1c6fee;
			}
		}
	}

	.player {
		.popup-content {
			height: 100vh;
			background: linear-gradient(to bottom, #fff, #f8f8f8);

			.topInfo {
				display: flex;
				align-items: center;
				flex-direction: column;
				padding: 20upx 40upx;

				.playerImg {
					margin-top: 60upx;
					height: 300upx;
					width: 300upx;
					border-radius: 50%;
					box-shadow: 0 8upx 24upx rgba(0, 0, 0, 0.15);
					transition: all 0.5s ease;
					animation: none;

					&.rotating {
						animation: albumRotate 20s linear infinite;
						animation-play-state: running;
					}

					&:not(.rotating) {
						animation: albumRotate 20s linear infinite;
						animation-play-state: paused;
					}

					@keyframes albumRotate {
						from {
							transform: rotate(0deg);
						}

						to {
							transform: rotate(360deg);
						}
					}
				}

				text {
					margin-top: 20upx;
					font-size: 28upx;
					color: #666;

					&.name {
						margin-top: 30upx;
						font-size: 36upx;
						color: #333;
						font-weight: 600;
					}
				}

				scroll-view {
					margin-top: 30upx;
					padding: 20upx;
					text-align: center;
					height: 300upx;

					// #ifdef APP-PLUS
					height: 500upx;
					// #endif

					view {
						font-size: 28upx;
						color: #999;
						line-height: 2;
					}
				}

				.progress-bar {
					width: 90%;
					display: flex;
					align-items: center;
					margin: 30upx 0;

					.time {
						font-size: 24upx;
						color: #999;
						width: 80upx;
						text-align: center;
					}

					.progress-wrapper {
						flex: 1;
						height: 4upx;
						background: rgba(0, 0, 0, 0.1);
						margin: 0 20upx;
						border-radius: 2upx;
						position: relative;

						.progress-inner {
							position: absolute;
							left: 0;
							top: 0;
							height: 100%;
							background: linear-gradient(to right, #2979ff, #5e96ff);
							border-radius: 2upx;
							transition: width 0.1s linear;

							.progress-dot {
								position: absolute;
								right: -8upx;
								top: 50%;
								transform: translateY(-50%);
								width: 16upx;
								height: 16upx;
								background: #fff;
								border-radius: 50%;
								box-shadow: 0 2upx 4upx rgba(0, 0, 0, 0.2);
							}
						}

						&:active {
							.progress-inner {
								.progress-dot {
									transform: translateY(-50%) scale(1.2);
									box-shadow: 0 2upx 6upx rgba(0, 0, 0, 0.3);
								}
							}
						}
					}
				}
			}

			.playerOption {
				margin: 0 auto;
				width: 80%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.iconfont {
					font-size: 60upx;
					color: #2979ff;
					padding: 20upx;
					transition: all 0.3s ease;

					&:active {
						transform: scale(0.9);
						color: #1c6fee;
					}

					&.icon-kaishibofang,
					&.icon-zantingbofang {
						font-size: 80upx;
					}
				}
			}
		}
	}
</style>