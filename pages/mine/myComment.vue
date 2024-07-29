<template>
	<view>
		<uni-nav-bar left-icon="left" leftText="返回" title="我的评论列表" background-color="#2979ff" color="#fff"
			@clickLeft="toBack" fixed />
		<view v-for="(item,index) in commentList" :key="index">
			<uni-card v-if="commentList" :title="'歌曲：'+item.name" :extra="item.itId===0?'评论':'回复'">
				<text class="uni-body">{{item.content}}</text>
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
				pageNum: 1,
				pageSize: 6,
				total: null,
				status: null
			};
		},
		onPageScroll(e) {
			const height = document.documentElement.scrollHeight
			const top = document.documentElement.clientHeight
			if (height - top == e.scrollTop) {
				if (this.total >= this.pageNum * this.pageSize) {
					this.pageNum++
					this.getCommentList()
				}
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
</style>