<template>
	<view>
		<uni-nav-bar title="登录" background-color="#2979ff" color="#fff" />
		<image class="logo" src="/static/logo.png" />

		<uni-easyinput class="input" prefixIcon="person" trim="all" v-model="username" placeholder="请输入账号" />
		<uni-easyinput class="input" prefixIcon="locked" trim="all" v-model="password" placeholder="请输入密码"
			type="password" />

		<button class="btn" @click="loginHandler">登录</button>

		<view class="bottom">
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
				password: '123456'
			};
		},
		methods: {
			loginHandler() {
				request({
					url: 'music/user',
					method: 'GET',
					data: {
						username: this.username
					}
				}).then(res => {
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
			errorToast() {
				uni.showToast({
					title: "账号/密码错误",
					icon: "error",
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
					success: (res) => {
						// user存入全局
						uni.setStorageSync("user", user)
						// 跳转
						uni.navigateTo({
							url: "/pages/index/index"
						})
					}
				})
			},
			otherLogin(type) {
				uni.showToast({
					title: "暂不支持" + type + "登录",
					icon: 'error'
				})
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
		width: 90%;
		margin: 30upx 5%;
	}

	.bottom {
		width: 100%;
		font-size: 24upx;
		position: absolute;
		bottom: 100upx;
		color: #aaa;

		p {
			text-align: center;
		}

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