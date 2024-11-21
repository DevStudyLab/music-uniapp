<template>
	<view class="comment-container">
		<uni-nav-bar left-icon="left" leftText="返回" title="我的评论" background-color="#2979ff" color="#fff"
			@clickLeft="toBack" fixed status-bar :border="false" />
		<view v-for="(item, index) in commentList" :key="index">
			<uni-card v-if="commentList" :title="'歌曲：' + item.name" :extra="item.itId === 0 ? '评论' : '回复'">
				<text class="uni-body">{{ item.content }}</text>
			</uni-card>
		</view>
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText"></uni-load-more>
	</view>
</template>

<script>
	import request from '../../utils/request';
	export default {
		data() {
			return {
				id: null,
				commentList: [],
				pageNum: 1,
				pageSize: 6,
				total: 0,
				status: 'more',
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '加载中...',
					contentnomore: '没有更多数据了'
				}
			};
		},
		onReachBottom() {
			console.log('触底了！')
			if (this.status === 'loading') return
			if (this.total > this.commentList.length) {
				this.status = 'loading'
				this.pageNum++
				this.getCommentList()
			}
		},
		onLoad() {
			this.id = uni.getStorageSync('user').id
			this.getCommentList()
		},
		methods: {
			getCommentList() {
				request({
					url: 'music/comment/mine',
					get: 'GET',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						userId: this.id
					}
				}).then(res => {
					console.log(res);
					this.commentList.push(...res.data.list)
					this.total = res.data.count
					if (this.total >= this.pageNum * this.pageSize) {
						this.status = 'more'
					} else {
						this.status = 'noMore'
					}
				})
			},
			toBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.comment-container {
		min-height: 100vh;
		background: #f8f8f8;
		padding-bottom: 100upx;

		::v-deep .uni-card {
			margin: 20upx 0;
			border-radius: 16upx;
			box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.05);
			border: none;
			overflow: hidden;
			transition: all 0.3s ease;

			&:active {
				transform: translateY(2upx);
				box-shadow: 0 2upx 8upx rgba(0, 0, 0, 0.05);
			}

			.uni-card__header {
				padding: 24upx;
				border-bottom: 2upx solid #f5f5f5;

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
						padding: 4upx 16upx;
						border-radius: 20upx;
					}
				}
			}

			.uni-card__content {
				padding: 24upx;

				.uni-body {
					font-size: 28upx;
					color: #666;
					line-height: 1.6;
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