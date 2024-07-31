<template>
	<view>
		<uni-nav-bar title="首页" background-color="#2979ff" color="#fff" fixed />
		<uni-search-bar :focus="true" @confirm="search" />

		<swiper class="block" circular indicator-dots autoplay :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in 4" :key="index">
				<image class="img" :src="'../../static/banner ('+(index+1)+').jpg'"></image>
			</swiper-item>
		</swiper>

		<uni-section title="热门歌曲" type="line"></uni-section>
		<view class="hotSongList">
			<view class="item" v-for="(item,index) in songList.slice(0,3)" :key="index">
				<image class="img" src="../../static/player.jpeg"></image>
				<view class="rightBox">
					<uni-tag class="tag" :text="item.type" type="primary" size="small" />
					<p class="name"><strong>{{item.name}}</strong></p>
					<p>歌手：{{item.singer}}</p>
				</view>
			</view>
		</view>

		<uni-section title="歌单列表" type="line"></uni-section>
		<view class="menuList">
			<view v-for="(item,index) in menuList" :key="index">
				<view class="songLine">
					<image :src="item.image" class="img"></image>
					<view>
						<view class="iconfont icon-31zhuanfa" @click="operation"></view>
						<p class="name"><strong>{{item.name}}</strong></p>
						<p>{{item.description}}</p>
						<p class="time">{{item.createTime}}</p>
					</view>
				</view>
			</view>
		</view>

		<bottomPlayer name='歌名' singer='歌手' content='/music/file/download/music.mp3/DOCUMENT'></bottomPlayer>


		<uni-popup class="popup" ref="share" type="share" safeArea backgroundColor="#fff">
			<uni-popup-share></uni-popup-share>
		</uni-popup>
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
				songList: [],
				menuList: [],
			}
		},
		onLoad() {
			this.getSongs()
			this.getMenuList()
		},
		methods: {
			search(res) {
				console.log(res.value);
				// 跳转音乐列表
			},
			getSongs() {
				request({
					url: 'music/song',
					method: 'GET',
					data: {
						hot: '是'
					}
				}).then(res => {
					this.songList = res.data.list
				})
			},
			getMenuList() {
				request({
					url: 'music/menu',
					method: 'GET'
				}).then(res => {
					this.menuList = res.data.list
					this.images = res.data.list.map(i => i.image = addBase(i.image))
				})
			},
			operation() {
				this.$refs.share.open()
			}
		}
	}
</script>

<style lang="scss">
	.block {

		.img {
			width: 100%;
			height: 100%;
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

	.menuList {
		.songLine {
			display: flex;
			padding: 10upx;

			.icon-31zhuanfa {
				padding: 10upx 0;
				font-size: 40upx;
				float: right;
			}

			.img {
				width: 150upx;
				height: 150upx;
				border-radius: 15upx;
			}

			>view {
				padding-left: 10upx;
				line-height: 50upx;
				width: calc(100% - 170upx);

				.name {
					font-size: 40upx;
				}

				.time {
					float: right;
					font-size: 24upx;
					color: #ccc;
				}
			}
		}
	}

	.popup {
		display: fixed;
		z-index: 999;
	}
</style>