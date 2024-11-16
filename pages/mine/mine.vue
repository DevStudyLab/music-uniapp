<template>
	<view>
		<uni-nav-bar title="我的" background-color="#2979ff" color="#fff" :border="false" fixed />

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
			<view class="block" @click="toLogin">
				<view class="iconfont icon-qiehuanyonghu" />
				<p>切换账号</p>
			</view>
		</view>

		<uni-section title="你创建的歌单" type="line"></uni-section>
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
			this.avatar = addBase(uni.getStorageSync('user').avatar)
			this.username = uni.getStorageSync('user').username
			this.getMenuList()
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
			toLogin() {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			toMenu(id) {
				uni.navigateTo({
					url: `/pages/menu/menu?menuId=${id}`
				})
			},
			operation() {
				this.$refs.share.open()
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
			top: -100upx;
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
		padding: 10upx;

		.icon-31zhuanfa {
			padding: 10upx 0;
			font-size: 40upx;
			float: right;
		}

		.img {
			width: 150upx;
			height: 150upx;
			border-radius: 15upx;
		}

		>view {
			padding-left: 10upx;
			line-height: 50upx;
			width: calc(100% - 170upx);

			.time {
				float: right;
				font-size: 24upx;
				color: #ccc;
			}

			.name {
				font-size: 40upx;
			}

			.description {
				// 字数超过一行隐藏
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.popup {
		display: fixed;
		z-index: 999;
	}
</style>