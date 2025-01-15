<template>
	<view>
		<uni-nav-bar title="登录" background-color="#2979ff" color="#fff" status-bar :border="false" />
		<image class="logo" src="/static/logo.png" />

		<uni-easyinput class="input" prefixIcon="person" trim="all" v-model="username" placeholder="请输入账号" />
		<uni-easyinput class="input" prefixIcon="locked" trim="all" v-model="password" placeholder="请输入密码"
			type="password" />


		<p @click="toRegister" v-if="status === 0">没有账号？去注册</p>
		<p @click="toLogin" v-else>已有账号？去登录</p>

		<button class="btn" @click="loginHandler" v-if="status === 0">登录</button>
		<button class="btn" @click="registerHandler" v-else>注册</button>
		<view class="bottom" v-if="status === 0">
			<p>其他登录方式</p>
			<view class="line">
				<view class="iconfont icon-QQ" @click="otherLogin('QQ')" />
				<view class="iconfont icon-weixin" @click="otherLogin('微信')" />
				<view class="iconfont icon-weibo" @click="otherLogin('微博')" />
			</view>
		</view>

	</view>
</template>

<script>
	import request from '../../utils/request.js';
	export default {
		data() {
			return {
				username: null,
				password: null,
				status: 0
			};
		},
		onLoad() {
			// 检查是否有存储的用户信息
			const savedUser = uni.getStorageSync('user');
			if (savedUser) {
				// 如果有存储的用户信息，直接跳转到首页
				uni.switchTab({
					url: "/pages/index/index"
				});
				return;
			}
			
			// 检查是否首次打开app的逻辑
			const isFirstOpen = !uni.getStorageSync('isNotFirstOpen');
			if (isFirstOpen) {
				uni.showModal({
					title: '欢迎使用',
					content: '感谢您下载使用我们的音渊APP测试版！\n\n在使用app前请先注册属于您的个人账号，如测试过程中您遇见任何bug，请联系邮箱：email@weng23.us.kg\n\n希望您能在这里找到属于自己的音乐世界！',
					showCancel: false,
					confirmText: '知道了',
					success: function(res) {
						uni.setStorageSync('isNotFirstOpen', true);
					}
				});
			}
		},
		methods: {
			loginHandler() {
				uni.showLoading({
					title: '登录中',
					mask: true
				})

				request({
					url: 'music/user',
					method: 'GET',
					data: {
						username: this.username
					}
				}).then(res => {
					uni.hideLoading()
					let user = res.data.list[0]
					if (user === undefined) {
						this.errorToast()
					} else {
						if (this.password.toString() === user.password && this.username === user.username) {
							this.successToast(user)
						} else {
							this.errorToast()
						}
					}
				})
			},
			registerHandler() {
				request({
					url: 'music/user',
					method: 'GET',
					data: {
						username: this.username
					}
				}).then(res => {
					if (res.data.list.length === 0) {
						request({
							url: 'music/user',
							method: 'POST',
							data: {
								username: this.username,
								password: this.password
							}
						}).then(res => {
							uni.showToast({
								title: '注册成功',
								mask: true,
								success: () => {
									this.status = 0
								}
							})
						})
					} else {
						uni.showToast({
							title: '账号名已被占用',
							icon: 'error',
							mask: true,
						})
					}
				})
			},
			errorToast() {
				uni.showToast({
					title: "账号/密码错误",
					icon: "error",
					mask: true,
					success: () => {
						this.username = null
						this.password = null
					}
				})
			},
			successToast(user) {
				uni.showToast({
					title: "登录成功",
					icon: "success",
					mask: true,
					success: (res) => {
						uni.setStorageSync("user", user)
						let timer = setTimeout(() => {
							uni.switchTab({
								url: "/pages/index/index"
							})
						}, 500)
						setTimeout(timer)
					}
				})
			},
			otherLogin(type) {
				uni.showToast({
					title: "暂不支持" + type + "登录",
					icon: 'error',
					mask: true
				})
			},
			toRegister() {
				this.status = 1
			},
			toLogin() {
				this.status = 0
			}
		}
	}
</script>

<style lang="scss">
	.logo {
		width: 240upx;
		height: 240upx;
		margin: 80upx auto 60upx;
		display: block;
		border-radius: 40upx;
		box-shadow: 0 8upx 24upx rgba(0, 0, 0, 0.1);
		background: #fff;
		animation: logoFloat 3s ease-in-out infinite;
		overflow: hidden;
		position: relative;

		object-fit: cover;
		padding: 0;

		@keyframes logoFloat {

			0%,
			100% {
				transform: translateY(0);
			}

			50% {
				transform: translateY(-15upx);
			}
		}

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg,
					transparent,
					rgba(255, 255, 255, 0.2),
					transparent);
			transform: skewX(-25deg);
			animation: logoShine 2s ease-in-out infinite;
		}

		@keyframes logoShine {
			0% {
				transform: skewX(-25deg) translateX(-150%);
			}

			50% {
				transform: skewX(-25deg) translateX(0);
			}

			100% {
				transform: skewX(-25deg) translateX(150%);
			}
		}
	}

	::v-deep .input {
		width: 85%;
		margin: 30upx auto;

		.uni-easyinput__content {
			background-color: #f8f8f8;
			border: none;
			border-radius: 12upx;
			padding: 16upx 20upx;
			transition: all 0.3s ease;

			&:hover,
			&:focus {
				background-color: #f0f0f0;
				box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.05);
			}

			.uni-icons {
				color: #999;
				font-size: 36upx;
				margin-right: 10upx;
			}

			.uni-easyinput__content-input {
				font-size: 28upx;
				color: #333;

				&::placeholder {
					color: #999;
					font-size: 26upx;
				}
			}
		}

		.is-focused {
			background-color: #fff !important;
			box-shadow: 0 4upx 16upx rgba(41, 121, 255, 0.1);
			border: 2upx solid rgba(41, 121, 255, 0.3);
		}
	}

	.btn {
		width: 85%;
		height: 88upx;
		margin: 50upx auto;
		background: linear-gradient(to right, #2979ff, #5e96ff);
		border-radius: 44upx;
		color: #fff;
		font-size: 32upx;
		font-weight: 500;
		letter-spacing: 2upx;
		box-shadow: 0 8upx 16upx rgba(41, 121, 255, 0.2);
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.98);
			box-shadow: 0 4upx 8upx rgba(41, 121, 255, 0.2);
		}
	}

	p {
		font-size: 26upx;
		text-align: center;
		color: #666;
		margin: 20upx 0;

		&:active {
			color: #2979ff;
		}
	}

	.bottom {
		width: 100%;
		position: absolute;
		bottom: 100upx;

		p {
			font-size: 24upx;
			color: #999;
			margin-bottom: 30upx;

			&::before,
			&::after {
				content: '';
				display: inline-block;
				width: 100upx;
				height: 2upx;
				background: #eee;
				margin: 0 20upx;
				vertical-align: middle;
			}
		}

		.line {
			width: 100%;
			display: flex;
			justify-content: center;

			.iconfont {
				margin: 0 30upx;
				font-size: 64upx;
				color: #666;
				transition: all 0.3s ease;

				&:active {
					transform: scale(0.9);
					color: #2979ff;
				}
			}
		}
	}
</style>