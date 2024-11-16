<template>
	<view>
		<uni-nav-bar left-icon="left" leftText="返回" title="我收到的回复" background-color="#2979ff" color="#fff"
			@clickLeft="toBack" fixed status-bar :border="false" />
		<view v-for="(item,index) in commentList" :key="index">
			<uni-card v-if="item.childComments" :title="'评论'+(index+1)" extra="回复">
				<text>原评论：{{item.content}}</text>
				<view v-for="(item2,index2) in item.childComments" :key="index2">
					<text>{{item2.user.username}}</text>
					<text class=" uni-body">评论:{{item2.content}}</text>
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
</style>