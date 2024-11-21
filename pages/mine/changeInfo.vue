<template>
	<view>
		<uni-nav-bar left-icon="left" leftText="返回" title="个人信息修改" background-color="#2979ff" color="#fff"
			@clickLeft="toBack" status-bar :border="false" />

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
		background: linear-gradient(to bottom, #f8f8f8, #fff);

		.imgBox {
			display: flex;
			justify-content: center;
			margin-bottom: 60upx;
			position: relative;

			.avatar {
				width: 180upx;
				height: 180upx;
				border-radius: 50%;
				box-shadow: 0 8upx 32upx rgba(41, 121, 255, 0.15);
				border: 4upx solid rgba(255, 255, 255, 0.9);
				transition: all 0.3s ease;
				position: relative;

				&:active {
					transform: scale(0.95);
				}

				&::after {
					content: '点击更换头像';
					position: absolute;
					bottom: -40upx;
					left: 50%;
					transform: translateX(-50%);
					font-size: 24upx;
					color: #999;
					white-space: nowrap;
				}
			}
		}

		::v-deep .input {
			margin-bottom: 30upx;

			.uni-easyinput__content {
				background: #fff;
				border-radius: 12upx;
				padding: 16upx 24upx;
				box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.05);
				border: 2upx solid transparent;
				transition: all 0.3s ease;

				.uni-icons {
					color: #2979ff;
				}

				.uni-easyinput__content-input {
					font-size: 28upx;
					color: #333;

					&::placeholder {
						color: #999;
					}
				}

				&.is-focused {
					border-color: #2979ff;
					box-shadow: 0 4upx 20upx rgba(41, 121, 255, 0.15);
				}
			}
		}

		::v-deep .uni-data-checkbox {
			margin-top: 40upx;
			display: flex;
			justify-content: center;

			.uni-data-checkbox-item {
				margin: 0 20upx;

				.uni-checkbox-input {
					border-radius: 8upx;
					border-color: #2979ff;

					&.uni-checkbox-input-checked {
						background: #2979ff;
					}
				}
			}

			.checkbox__inner {
				padding: 16upx 40upx;
				background: #f5f5f5;
				border-radius: 40upx;
				font-size: 28upx;
				color: #666;
				transition: all 0.3s ease;

				&.is-checked {
					background: #2979ff;
					color: #fff;
				}

				&:active {
					transform: scale(0.95);
				}
			}
		}
	}

	.btn {
		width: 85%;
		margin: 10upx auto;
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

	::v-deep .uni-popup-dialog {
		border-radius: 20upx;
		overflow: hidden;

		.uni-dialog-title {
			font-size: 32upx;
			color: #333;
			font-weight: 600;
		}

		.uni-dialog-content {

			.uni-dialog-content-text {
				font-size: 28upx;
				color: #666;
			}
		}

		.uni-dialog-button-group {
			border-top: 2upx solid #f5f5f5;

			.uni-dialog-button {
				font-size: 28upx;

				&:first-child {
					color: #666;
				}

				&:last-child {
					color: #2979ff;
					font-weight: 500;
				}
			}
		}
	}
</style>