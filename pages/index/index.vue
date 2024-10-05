<template>
	<view>
		<uni-nav-bar title="首页" background-color="#2979ff" color="#fff" fixed />
		<uni-search-bar v-model='searchVal' :focus="false" placeholder="输入想听的歌名" />

		<view v-if="!searchVal">
			<swiper class="block" circular indicator-dots autoplay :interval="3000" :duration="1000">
				<swiper-item v-for="(item,index) in 4" :key="index">
					<image class="img" :src="'../../static/banner ('+(index+1)+').jpg'"></image>
				</swiper-item>
			</swiper>

			<uni-section title="热门歌曲" type="line"></uni-section>
			<view class="hotSongList">
				<view class="item" v-for="(item,index) in hotSongList.slice(0,3)" :key="index" @click="setMusic(index)">
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
				<view v-for="(item,index) in menuList" :key="index" @click="toMenu(item.id)">
					<view class="songLine">
						<image :src="item.image" class="img"></image>
						<view>
							<view class="iconfont icon-31zhuanfa" @click.stop="operation"></view>
							<p class="name"><strong>{{item.name}}</strong></p>
							<p class="description">{{item.description}}</p>
							<p class="time">{{item.createTime}}</p>
						</view>
					</view>
				</view>
			</view>

			<view style="height: 100upx;"></view>
		</view>
		<view v-else>
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


		<bottomPlayer class="bottom" :id='song.id' :name='song.name' :singer='song.singer' :content='song.content'>
		</bottomPlayer>

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
				searchVal: null,
				hotSongList: [],
				songList: [],
				menuList: [],
				song: {
					id: null,
					name: null,
					singer: null,
					content: null
				}
			}
		},
		watch: {
			searchVal() {
				request({
					url: 'music/song',
					method: 'GET',
					data: {
						name: this.searchVal
					}
				}).then(res => {
					this.songList = res.data.list
				})
			}
		},
		onLoad() {
			uni.$on('update', res => {
				this.song = uni.getStorageSync('song')
			})
			this.getSongs()
			this.getMenuList()
		},
		methods: {
			getSongs() {
				request({
					url: 'music/song',
					method: 'GET',
					data: {
						hot: '是'
					}
				}).then(res => {
					this.hotSongList = res.data.list
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
			setMusic(index) {
				this.song = this.hotSongList[index]
				uni.setStorageSync('song', this.song)
			},
			toMenu(id) {
				uni.navigateTo({
					url: `/pages/menu/menu?menuId=${id}`
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

				.description {
					// 字数超过一行隐藏
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}

	.bottom {
		z-index: 99999;
		width: 100%;
		position: fixed;
		bottom: 100upx;
	}

	.popup {
		display: fixed;
		z-index: 99999;
	}
</style>