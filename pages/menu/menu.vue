<template>
	<view v-if="menuInfo">
		<uni-nav-bar title="首页" left-icon="left" leftText="返回" @clickLeft="toBack" background-color="#2979ff"
			color="#fff" fixed />

		<view class="top">
			<image class="img" :src="menuInfo.image"></image>
			<view class="right">
				<view class="time">{{menuInfo.createTime}}</view>
				<view><strong>{{menuInfo.name}}</strong></view>
				<view class="text">创建者：{{menuInfo.user.username}}</view>
				<uni-tooltip class="item" :content="menuInfo.description" placement="bottom">
					<view class="text">描述：{{menuInfo.description}}</view>
				</uni-tooltip>
			</view>
		</view>

		<view class="list">
			<view class="hotSongList">
				<view class="item" v-for="(item,index) in songList" :key="index" @click="setMusic(index)">
					<image class="img" src="../../static/player.jpeg"></image>
					<view class="rightBox">
						<uni-tag class="tag" :text="item.type" type="primary" size="small" />
						<p class="name"><strong>{{item.name}}</strong></p>
						<p>歌手：{{item.singer}}</p>
					</view>
				</view>
			</view>
		</view>

		<!-- TODO 如果是我的歌单，就可以编辑 -->

		<bottomPlayer class="bottom" :name='song.name' :singer='song.singer' :content='song.content'></bottomPlayer>
	</view>
</template>

<script>
	import request from '../../utils/request';
	import {
		addBase
	} from '../../utils/myFunction';
	export default {
		data() {
			return {
				id: null,
				menuList: null,
				menuInfo: null,
				songList: [],
				song: {
					name: null,
					singer: null,
					content: null
				}
			};
		},
		onLoad(data) {
			this.song = uni.getStorageSync('song')
			this.id = data.menuId
			this.getMenu()
		},
		methods: {
			getMenu() {
				request({
					url: 'music/menu',
					method: 'GET',
					data: {
						id: this.id
					}
				}).then(res => {
					console.log(res);
					this.menuInfo = res.data.list[0]
					this.menuInfo.image = addBase(this.menuInfo.image)
				})

				request({
					url: 'music/menu/detail',
					method: 'GET',
					data: {
						menuId: this.id
					}
				}).then(res => {
					console.log(res);
					this.songList = res.data.list[0].songList
				})
			},
			toBack() {
				uni.navigateBack()
			},
			setMusic(index) {
				this.song = this.songList[index]
				uni.setStorageSync('song', this.song)
				uni.$emit('update', true)
			}
		}
	}
</script>

<style lang="scss">
	.top {
		background-image: url('../../static/menuBg.png');
		background-size: 100%;
		display: flex;

		.img {
			margin: 20upx;
			width: 200upx;
			height: 200upx;
			border-radius: 20upx;
		}

		.right {
			width: calc(100% - 140px);
			height: 200upx;
			margin: 20upx 20upx 20upx 0;

			strong {
				font-size: 40upx;
			}

			.time {
				float: right;
				color: #666;
				font-size: 26upx;
			}

			.text {
				margin-top: 4upx;
				font-size: 28upx;
				// 字数超过俩行隐藏
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.hotSongList {

		.item {
			margin: 20upx 0;
			display: flex;

			.img {
				margin-left: 6upx;
				width: 150upx;
				height: 150upx;
				border-radius: 10upx;
			}

			.rightBox {
				margin-left: 10upx;
				width: calc(100% - 93px);

				.tag {
					float: right;
				}

				.name {
					font-size: 40upx;
					margin-bottom: 20upx;
				}
			}
		}
	}

	.bottom {
		z-index: 99999;
		width: 100%;
		position: fixed;
		bottom: 0;
	}
</style>