<template>
	<view>
		<view class="comment-list">
			<view v-for="(item, index) in commentList" :key="index">
				<view :class="item.itId === 0 ? 'comment' : 'comment child'">
					<view class="comment-header">
						<image class="userAvatar" :src="addBase(item.user.avatar)" mode="aspectFill" />
						<view class="user-info">
							<text class="username">{{ item.user.username }}</text>
							<text v-if="item.itId !== 0" class="reply-to">回复 <text
									class="reply-name">{{ name }}</text></text>
						</view>
						<view class="reply-btn" @click="reply(item.id)">
							<text class="iconfont icon-comment"></text>
							<text>回复</text>
						</view>
					</view>
					<view class="comment-content">
						<text>{{ item.content }}</text>
					</view>
					<view v-if="item.childComments && item.showChildren" class="child-comments">
						<recursiveComment :item='item.childComments' :name="item.user.username" :id="id">
						</recursiveComment>
					</view>
					<view v-if="item.childComments && !item.showChildren" @click="toggleChildren(item)">
						<text class="toggle-btn">显示更多评论</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部评论框 -->
		<view class="comment-bar">
			<button class="comment-input" @click="reply(0)">
				<text class="placeholder">说点什么吧...</text>
			</button>
		</view>

		<!-- 评论弹窗 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="发表评论" placeholder="请文明发言，共建和谐社区"
				@confirm="dialogConfirm">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import {
	addBase
} from '../../utils/myFunction';
import request from '../../utils/request';
export default {
	name: "recursiveComment",
	props: ['id', 'item', 'name'],
	data() {
		return {
			commentList: [],
			replyId: 0,
			showChildren: {}
		};
	},
	mounted() {
		if (this.item) {
			this.commentList = this.item
		} else {
			this.getComment()
		}
	},
	methods: {
		getComment() {
			if (this.id !== null) {
				request({
					url: 'music/comment',
					method: 'GET',
					data: {
						songId: this.id,
						itId: 0
					}
				}).then(res => {
					// 初始化每个评论的 showChildren 属性
					this.commentList = this.initializeShowChildren(res.data.list);
				})
			}
		},
		initializeShowChildren(comments) {
			return comments.map(comment => {
				comment.showChildren = false; // 初始化为 false
				if (comment.childComments) {
					comment.childComments = this.initializeShowChildren(comment.childComments); // 递归初始化
				}
				return comment;
			});
		},
		addBase(url) {
			return addBase(url)
		},
		reply(itId) {
			this.$refs.inputDialog.open()
			this.replyId = itId
		},
		dialogConfirm(val) {
			request({
				url: 'music/comment',
				method: 'POST',
				data: {
					content: val,
					itId: this.replyId,
					songId: this.id,
					userId: uni.getStorageSync('user').id
				}
			}).then(res => {
				this.$refs.inputDialog.close()
				// 将新评论添加到评论列表
				if (this.replyId === 0) {
					this.commentList.push({
						content: val,
						user: {
							username: uni.getStorageSync('user').username,
							avatar: uni.getStorageSync('user').avatar
						},
						itId: 0,
						id: res.data.id
					});
				} else {
					// 找到对应的父评论并添加子评论
					const parentComment = this.commentList.find(comment => comment.id === this.replyId);
					if (parentComment) {
						if (!parentComment.childComments) {
							parentComment.childComments = [];
						}
						parentComment.childComments.push({
							content: val,
							user: {
								username: uni.getStorageSync('user').username,
								avatar: uni.getStorageSync('user').avatar
							},
							itId: this.replyId,
							id: res.data.id
						});
					}
				}
			})
		},
		toggleChildren(item) {
			item.showChildren = !item.showChildren;
		}
	}
}
</script>

<style lang="scss">
.comment-list {
	padding: 0;
}

.comment {
	margin-bottom: 30upx;
	padding: 10upx;

	.comment-header {
		display: flex;
		align-items: flex-start;
		position: relative;

		.userAvatar {
			width: 72upx;
			height: 72upx;
			border-radius: 50%;
			margin-right: 20upx;
			border: 4upx solid #fff;
			box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.1);
		}

		.user-info {
			flex: 1;
			padding-right: 100upx;

			.username {
				font-size: 28upx;
				color: #333;
				font-weight: 600;
				margin-bottom: 8upx;
			}

			.reply-to {
				font-size: 24upx;
				color: #666;

				.reply-name {
					color: #2979ff;
				}
			}
		}

		.reply-btn {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			padding: 0 20upx;
			font-size: 24upx;
			color: #999;
		}
	}

	.comment-content {
		margin: 12upx 0 12upx 72upx;
		font-size: 28upx;
		color: #333;
		line-height: 1.6;
	}
}

.child-comments {
	margin-left: 50upx;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		left: -25upx;
		top: 0;
		bottom: 20upx;
		width: 2upx;
		background: #eee;
	}

	.comment {
		position: relative;
		margin-bottom: 20upx;

		&::before {
			content: '';
			position: absolute;
			left: -25upx;
			top: 36upx;
			width: 20upx;
			height: 2upx;
			background: #eee;
		}
	}
}

.comment-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20upx 30upx;
	background: #fff;
	box-shadow: 0 -2upx 10upx rgba(0, 0, 0, 0.05);
	z-index: 100000;
}

::v-deep .uni-popup-dialog {
	border-radius: 24upx;

	.uni-dialog-title {
		font-size: 30upx;
		color: #333;
		font-weight: 600;
		text-align: left;
		margin-bottom: 20upx;
		line-height: 30upx;
	}

	.uni-dialog-content {
		.uni-dialog-input {
			background: #f5f5f5;
			border: none;
			border-radius: 12upx;
			font-size: 28upx;

		}
	}

	.uni-dialog-button-group {
		margin-top: 30upx;
		display: flex;

		.uni-dialog-button {
			flex: 1;
			height: 80upx;
			line-height: 80upx;
			font-size: 28upx;

			&:last-child {
				color: #2979ff;
				font-weight: 500;
			}
		}
	}
}

.toggle-btn {
	color: #2979ff;
	cursor: pointer;
	font-size: 24upx;
}
</style>