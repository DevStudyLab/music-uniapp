<template>
	<view class="reply-container">
		<music-background style="z-index: 0;" type="waves" containerId="replyme-background" />
		<uni-nav-bar left-icon="left" leftText="返回" title="我收到的回复" background-color="#3883FF" color="#fff"
			@clickLeft="toBack" fixed status-bar :border="false" />
		<view v-for="(item,index) in commentList" :key="index">
			<uni-card v-if="item.childComments" :title="'评论 ' + (index + 1)" extra="回复">
				<text>原评论：{{item.content}}</text>
				<view v-for="(item2,index2) in item.childComments" :key="index2">
					<text>{{item2.user.username}}</text>
					<text class="uni-body">{{item2.content}}</text>
				</view>
			</uni-card>
		</view>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>

<script>
	import request from '../../utils/request';
	export default {
		data() {
			return {
				id: null,
				commentList: [],
				reply: [],
				status: null
			};
		},
		onLoad() {
			this.id = uni.getStorageSync('user').id
			this.getCommentList()
		},
		methods: {
			getCommentList() {
				request({
					url: 'music/comment',
					get: 'GET',
					data: {
						userId: this.id
					}
				}).then(res => {
					console.log(res);
					this.commentList.push(...res.data.list)
				})
			},
			toBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.reply-container {
		background: #f8f8f8;

		::v-deep .uni-card {
			margin-bottom: 30upx;
			border-radius: 20upx;
			background: #fff;
			border: none;
			overflow: hidden;
			box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.05);
			transition: all 0.3s ease;
			position: relative;

			// 左侧装饰条
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				width: 6upx;
				background: linear-gradient(to bottom, #2979ff, #5e96ff);
				border-radius: 6upx;
				opacity: 0.8;
			}

			.uni-card__header {
				padding: 24upx;
				border-bottom: 2upx solid #f5f5f5;
				position: relative;
				overflow: hidden;

				// 添加波纹背景
				&::after {
					content: '';
					position: absolute;
					right: -60upx;
					top: -60upx;
					width: 120upx;
					height: 120upx;
					background: radial-gradient(circle, rgba(41, 121, 255, 0.1) 0%, transparent 70%);
					border-radius: 50%;
				}

				.uni-card__header-box {
					.uni-card__header-content {
						font-size: 28upx;
						color: #333;
						font-weight: 600;
					}

					.uni-card__header-extra-text {
						background: #2979ff;
						color: #fff;
						font-size: 24upx;
						padding: 4upx 20upx;
						border-radius: 30upx;
						transform: scale(0.9);
					}
				}
			}

			.uni-card__content {
				padding: 24upx;

				text {
					display: block;
					font-size: 28upx;
					color: #666;
					line-height: 1.6;
					margin-bottom: 20upx;

					// 原评论样式
					&:first-child {
						padding: 20upx;
						background: #f8f8f8;
						border-radius: 12upx;
						color: #999;
						font-style: italic;
					}
				}

				// 回复列表样式
				view {
					margin-top: 20upx;
					padding: 16upx;
					border-radius: 12upx;
					background: linear-gradient(to right, rgba(41, 121, 255, 0.05), transparent);

					text {
						margin: 0;

						// 用户名样式
						&:first-child {
							color: #2979ff;
							font-weight: 500;
							padding: 0;
							background: none;
							font-style: normal;

							&::after {
								content: '：';
								color: #999;
								font-weight: normal;
							}
						}

						// 评论内容样式
						&.uni-body {
							color: #333;
							margin-top: 8upx;
						}
					}

					// 交错效果
					&:nth-child(even) {
						background: linear-gradient(to left, rgba(41, 121, 255, 0.05), transparent);
					}
				}
			}

			// 悬停效果
			&:active {
				transform: translateY(2upx);
				box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.05);

				&::before {
					opacity: 1;
				}
			}
		}
	}

	::v-deep .uni-load-more {
		margin: 40upx 0;

		.uni-load-more__text {
			font-size: 26upx;
			color: #999;
		}
	}
</style>