<template>
	<view>
		<view class="bottom">
			<button class="btn" @click="reply(0)">评论</button>
		</view>
		<view v-for="(item,index) in commentList" :key="index">
			<view :class="item.itId===0?'comment':'comment child'">
				<image class="userAvatar" :src="addBase(item.user.avatar)" />
				<view class="line">
					<p class="font">
						{{item.user.username}}
						<block v-if="item.itId!==0">->{{name}}</block>
					</p>
					<p>{{item.content}}</p>
					<p class="right" @click="reply(item.id)">回复</p>
				</view>
			</view>
			<view v-if="item.childComments">
				<recursiveComment :item='item.childComments' :name="item.user.username" :id="id"></recursiveComment>
			</view>
		</view>

		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="评论" placeholder="请文明用语!"
				@confirm="dialogConfirm"></uni-popup-dialog>
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
						this.commentList = res.data.list
					})
				}
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
					this.commentList = []
					// this.getComment()
				})
			}
		}
	}
</script>

<style lang="scss">
	.bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 100000;

		.btn {
			width: 100%;
			background-color: #2979ff30;
		}
	}

	.comment {
		display: flex;

		.userAvatar {
			width: 100upx;
			height: 100upx;
			border-radius: 50%;
		}

		.line {
			width: 100%;
			padding-right: 20upx;

			.font {
				font-size: 26upx;
				margin-top: 10upx;
			}

			.right {
				float: right;
				font-size: 20upx;
				color: #ccc;
			}
		}

	}

	.child {
		margin-left: 50upx;
	}
</style>