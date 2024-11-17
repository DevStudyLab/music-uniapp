<template>
	<view>
		<uni-nav-bar title="登录" background-color="#2979ff" color="#fff" status-bar :border="false" />
		<image class="logo" src="/static/logo.png" />

		<uni-easyinput class="input" prefixIcon="person" trim="all" v-model="username" placeholder="请输入账号" />
		<uni-easyinput class="input" prefixIcon="locked" trim="all" v-model="password" placeholder="请输入密码"
			type="password" />

		<p @click="toRegister" v-if="status===0">没有账号？去注册</p>
		<p @click="toLogin" v-else>已有账号？去登录</p>

		<button class="btn" @click="loginHandler" v-if="status===0">登录</button>
		<button class="btn" @click="registerHandler" v-else>注册</button>

		<view class="bottom" v-if="status===0">
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
				username: 'weng',
				password: '123456',
				status: 0
			};
		},
		methods: {
			loginHandler() {
				uni.showLoading({
					mask: true,
					title: '登录中'
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
						uni.showLoading({
							title: '注册中',
							mask: true
						})
						request({
							url: 'music/user',
							method: 'POST',
							data: {
								username: this.username,
								password: this.password
							}
						}).then(res => {
							uni.hideLoading()
							uni.showToast({
								title: '注册成功',
								mask: true,
								success: () => {
									this.status = 0
								}
							})
						}).catch(() => {
							uni.hideLoading()
						})
					} else {
						uni.showToast({
							title: '账号名已被占用',
							icon: 'error',
							mask: true
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
		width: 300upx;
		height: 300upx;
		margin: 50upx calc(50% - 150upx);
	}

	.input {
		width: 80%;
		margin: 10px auto;
	}

	p {
		font-size: 24upx;
		text-align: center;
		color: #aaa;
	}

	.btn {
		margin-top: 30upx;
	}

	.bottom {
		width: 100%;
		position: absolute;
		bottom: 100upx;

		.line {
			width: 100%;
			display: flex;
			justify-content: center;

			.iconfont {
				margin: 20upx;
				font-size: 64upx;
			}
		}
	}
</style>