<template>
	<view>
		<uni-nav-bar title="我的" background-color="#3883FF" color="#fff" fixed status-bar :border="false" />

		<view class="top">
			<image src="../../static/mine-bg.png" class="bg"></image>
			<image class="img" :src="avatar"></image>
		</view>
		<p class="username">{{username}}</p>

		<view class="line">
			<view class="block" @click="toNext('changeInfo')">
				<view class="iconfont icon-xiugaixinxi" />
				<p>修改信息</p>
			</view>
			<view class="block" @click="toNext('myComment')">
				<view class="iconfont icon-wodepinglun" />
				<p>我的评论</p>
			</view>
			<view class="block" @click="toNext('replyMe')">
				<view class=" iconfont icon-shoudaohuifu" />
				<p>收到回复</p>
			</view>
			<view class="block" @click="logout">
				<view class="iconfont icon-qiehuanyonghu" />
				<p>切换账号</p>
			</view>
		</view>

		<view class="custom-section">
			<view class="section-content">
				<text class="section-title">我创建的歌单</text>
			</view>
		</view>

		<view v-for="(item,index) in menuList" :key="index" @click="toMenu(item.id)">
			<view class="songLine">
				<image :src="item.image" class="img"></image>
				<view>
					<view class="iconfont icon-31zhuanfa" @click.stop="operation"></view>
					<p class="name"><strong>{{item.name}}</strong></p>
					<p class="description">{{item.description}}</p>
					<p class="time">{{item.createTime}}</p>
				</view>
			</view>
		</view>
		<uni-popup class="popup" ref="share" type="share" safeArea backgroundColor="#fff">
			<uni-popup-share></uni-popup-share>
		</uni-popup>
	</view>
</template>

<script>
	import {
		addBase
	} from '../../utils/myFunction';
	import request from '../../utils/request';
	export default {
		data() {
			return {
				avatar: null,
				username: null,
				menuList: [],
				images: [],
			};
		},
		onLoad() {
			this.getMenuList()
		},
		onShow() {
			this.avatar = addBase(uni.getStorageSync('user').avatar)
			this.username = uni.getStorageSync('user').username
		},
		methods: {
			getMenuList() {
				request({
					url: 'music/menu',
					method: 'GET',
					data: {
						userId: uni.getStorageSync('user').id
					}
				}).then(res => {
					this.menuList = res.data.list
					this.images = res.data.list.map(i => i.image = addBase(i.image))
				})
			},
			toNext(path) {
				uni.navigateTo({
					url: '/pages/mine/' + path
				})
			},
			toMenu(id) {
				uni.navigateTo({
					url: `/pages/menu/menu?menuId=${id}`
				})
			},
			operation() {
				this.$refs.share.open()
			},
			logout() {
				// 清除存储的用户信息
				uni.removeStorageSync('user');
				// 跳转到登录页
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		}
	}
</script>

<style lang="scss">
	.top {
		padding-top: 30upx;
		display: flex;
		justify-content: center;

		.bg {
			position: absolute;
			z-index: -1;
			width: 100%;
			height: 300px;
			top: 0px;
		}

		.img {
			border: 1px solid #ccc;
			width: 300upx;
			height: 300upx;
			border-radius: 50%;
		}
	}

	.username {
		margin-top: 10upx;
		text-align: center;
		mix-blend-mode: difference;
		color: #fff;
	}

	.line {
		margin-top: 20upx;
		display: flex;

		.block {
			padding: 30upx 0;
			width: 25%;
			text-align: center;
			border-radius: 20upx;

			>p {
				font-size: 28upx;
			}

			.iconfont {
				font-size: 50upx;
			}
		}
	}

	.songLine {
		display: flex;
		padding: 20upx;
		margin: 20upx;
		background: #fff;
		border-radius: 16upx;
		box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.98);
			background: #f8f8f8;
		}

		.img {
			width: 150upx;
			height: 150upx;
			border-radius: 12upx;
			box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.1);
		}

		>view {
			padding-left: 24upx;
			flex: 1;
			position: relative;

			.icon-31zhuanfa {
				position: absolute;
				right: 20upx;
				top: 20upx;
				font-size: 40upx;
				color: #999;
				padding: 10upx;
				transition: all 0.3s ease;

				&:active {
					transform: scale(0.9) rotate(45deg);
					color: #2979ff;
				}
			}

			.name {
				font-size: 36upx;
				color: #333;
				margin-bottom: 12upx;

				strong {
					font-weight: 600;
				}
			}

			.description {
				font-size: 26upx;
				color: #666;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				line-height: 1.6;
				margin-bottom: 12upx;
			}

			.time {
				font-size: 24upx;
				color: #999;
			}
		}
	}

	::v-deep .uni-section {
		padding: 10upx 15upx 0upx;

		.uni-section-header {
			position: relative;
			display: flex;
			align-items: center;
			margin-bottom: 12upx;

			.uni-section__content-title {
				font-size: 32upx;
				font-weight: 700;
				color: #333;
				position: relative;
				padding-left: 20upx;
				letter-spacing: 1upx;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 6upx;
					height: 28upx;
					border-radius: 3upx;
					background: linear-gradient(to bottom, #1c6fee, #4785ee);
				}
			}

			&::after {
				content: '';
				position: absolute;
				left: 20upx;
				bottom: -8upx;
				width: 50upx;
				height: 3upx;
				background: linear-gradient(to right, #2979ff, transparent);
				border-radius: 2upx;
			}
		}
	}

	::v-deep .uni-section:hover {
		.uni-section__content-title {
			&::before {
				background: linear-gradient(to bottom, #1c6fee, #4785ee);
			}
		}

		.uni-section-header::after {
			width: 80upx;
			transition: width 0.3s ease;
		}
	}

	.popup {
		display: fixed;
		z-index: 999;
	}

	.custom-section {
		padding: 20upx 30upx;
		margin: 20upx;
		position: relative;
		background: linear-gradient(135deg, rgba(41, 121, 255, 0.25), rgba(41, 121, 255, 0.15));
		border-radius: 16upx;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.15);
		border: 1px solid rgba(255, 255, 255, 0.2);
		z-index: 1;

		.section-content {
			position: relative;
			display: flex;
			align-items: center;
			padding-left: 24upx;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 8upx;
				height: 32upx;
				border-radius: 4upx;
				background: linear-gradient(to bottom, #2979ff, #1c6fee);
				box-shadow: 0 2upx 6upx rgba(41, 121, 255, 0.3);
			}

			.section-title {
				font-size: 36upx;
				font-weight: 600;
				color: #ffffff;
				letter-spacing: 2upx;
				text-shadow: 2upx 2upx 4upx rgba(0, 0, 0, 0.3);
			}

			&::after {
				content: '';
				position: absolute;
				left: 30upx;
				bottom: -2upx;
				width: 60upx;
				height: 4upx;
				background: linear-gradient(to right, #2979ff, transparent);
				border-radius: 2upx;
				transition: width 0.3s ease;
			}

			&:hover::after {
				width: 120upx;
			}
		}
	}
</style>