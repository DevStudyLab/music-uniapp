<template>
	<view>
		<uni-nav-bar left-icon="left" leftText="返回" title="个人信息修改" background-color="#2979ff" color="#fff"
			@clickLeft="toBack" />

		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="success" cancelText="留在此页" confirmText="返回上一页" content="个人信息更新成功"
				@confirm="toBack"></uni-popup-dialog>
		</uni-popup>

		<view class="box">
			<view class="imgBox">
				<image class="avatar" :src="addBase(user.avatar)" @click="chooseImg" />
			</view>
			<uni-easyinput class="input" prefixIcon="person" trim="all" v-model="user.username" placeholder="请输入账号" />
			<uni-easyinput class="input" prefixIcon="locked" trim="all" v-model="user.password" placeholder="请输入密码" />
			<uni-easyinput class="input" prefixIcon="email" trim="all" v-model="user.email" placeholder="请输入邮箱" />
			<uni-easyinput class="input" prefixIcon="flag" trim="all" v-model="user.age" placeholder="请输入年龄" />
			<uni-data-checkbox mode="button" v-model="gender" :localdata="sex" />
		</view>

		<button class="btn" @click="confirm">确认修改</button>
	</view>
</template>

<script>
	import {
		addBase
	} from '../../utils/myFunction';
	import uploadFile from '../../utils/uploadFile';
	import request from '../../utils/request';
	export default {
		data() {
			return {
				user: {
					id: null,
					avatar: null,
					username: null,
					password: null,
					email: null,
					age: null,
					gender: null
				},
				gender: null,
				sex: [{
					text: '男',
					value: 0
				}, {
					text: '女',
					value: 1
				}]
			};
		},
		onLoad() {
			let user = uni.getStorageSync('user')
			this.user = user
			this.gender = user.gender === '男' ? 0 : 1
		},
		methods: {
			chooseImg() {
				uploadFile().then(res => {
					this.user.avatar = res
					console.log(res);
				})
			},
			addBase(path) {
				return addBase(path)
			},
			confirm() {
				this.user.gender = this.gender === 0 ? '男' : '女'
				request({
					url: 'music/user',
					method: 'PUT',
					data: this.user
				}).then(res => {
					uni.setStorageSync('user', this.user)
					this.$refs.alertDialog.open()
				})
			},
			toBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.box {
		padding: 40upx;

		.imgBox {
			display: flex;
			justify-content: center;

			.avatar {
				width: 200upx;
				height: 200upx;
				border: 1px solid #ccc;
				border-radius: 50%;
			}
		}

		.input {
			margin-top: 20upx;
		}

		.input>:last-child {
			margin-bottom: 10upx;
		}
	}
</style>