<template>
	<view>
		<view v-for="(item,index) in commentList" :key="index">
			<view class="comment">
				<image class="userAvatar" :src="addBase(item.user.avatar)" />
				<view>
					<p>{{item.user.username}}</p>
					<p>{{item.content}}</p>
				</view>
			</view>
			<view class="child" v-if="item.childComments">
				<recursiveComment :item='item.childComments'></recursiveComment>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		addBase
	} from '../../utils/myFunction';
	import request from '../../utils/request';
	export default {
		name: "recursiveComment",
		props: ['id', 'item'],
		data() {
			return {
				commentList: []
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
			},
			addBase(url) {
				return addBase(url)
			}
		}
	}
</script>

<style lang="scss">
	.comment {
		display: flex;

		.userAvatar {
			width: 100upx;
			height: 100upx;
			border-radius: 50%;
		}
	}

	.child {
		margin-left: 50upx;
	}
</style>