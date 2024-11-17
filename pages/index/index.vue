<template>
	<view>
		<uni-nav-bar title="首页" background-color="#2979ff" color="#fff" status-bar :border="false" fixed />
		<uni-search-bar v-model='searchVal' :focus="false" placeholder="输入想听的歌名" />

		<view v-if="!searchVal">
			<swiper class="block" circular indicator-dots autoplay :interval="4000" :duration="1500">
				<swiper-item v-for="(item,index) in 4" :key="index">
					<image class="img" :src="'../../static/banner ('+(index+1)+').jpg'"></image>
				</swiper-item>
			</swiper>

			<uni-section title="歌单列表" type="line"></uni-section>
			<div class="menu-scroll-container">
				<div v-for="(item, index) in menuList" :key="index" class="menu-item" @click="toMenu(item.id)">
					<img :src="item.image" class="menu-image" alt="Menu Item Image" />
					<div class="menu-info">
						<p class="menu-name">{{ item.name }}</p>
					</div>
				</div>
			</div>

			<uni-section title="热门歌曲" type="line"></uni-section>
			<view class="hotSongList">
				<view class="item" v-for="(item,index) in hotSongList" :key="index" @click="setMusic(index)">
					<image class="img" src="../../static/player.jpeg"></image>
					<view class="rightBox">
						<uni-tag class="tag" :text="item.type" type="primary" size="small" />
						<p class="name"><strong>{{item.name}}</strong></p>
						<p>歌手：{{item.singer}}</p>
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
			},
		}
	}
</script>

<style lang="scss">
	.menu-scroll-container {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		padding: 10px;

		.menu-item {
			margin-right: 10px;
			flex: 0 0 auto;
			width: 100px;
			position: relative;

			.menu-image {
				width: 100px;
				height: auto;
				object-fit: cover;
				border-radius: 8px;
			}

			.menu-info {
				position: absolute;
				bottom: 5px;
				left: 5px;
				right: 5px;
				background: rgba(0, 0, 0, 0.5);
				color: #fff;
				padding: 10px;
				border-radius: 8px;
				opacity: 0.8;

				.menu-name {
					text-align: center;
					font-size: 14px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}


	.songLine {
		display: flex;
		align-items: center;
	}

	.info-container {
		margin-left: 16px;
	}

	.icon-31zhuanfa {
		font-size: 24px;
		color: #999;
		cursor: pointer;
	}

	.description {
		margin-top: 8px;
		font-size: 14px;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}



	.block {

		.img {
			width: 100%;
			height: 100%;
		}
	}

	.hotSongList {

		.item {
			margin: 10upx;
			display: flex;

			.img {
				margin-left: 6upx;
				width: 100upx;
				height: 100upx;
				border-radius: 10upx;
			}

			.rightBox {
				margin: 0 10upx 16upx 10upx;
				width: calc(100% - 100upx);

				.tag {
					float: right;
				}

				.name {
					font-size: 40upx;
				}
			}
		}

		.item:not(:last-child) {
			border-bottom: #ccc 1px solid;
		}
	}

	.menuList {
		.songLine {
			display: flex;

			.icon-31zhuanfa {
				font-size: 40upx;
				float: right;
			}

			.img {
				width: 120upx;
				height: 120upx;
				border-radius: 15upx;
			}

			>view {
				padding-left: 10upx;
				line-height: 50upx;
				width: calc(100% - 130upx);

				.name {
					font-size: 40upx;
				}

				.time {
					font-size: 24upx;
					color: #ccc;
				}

				.description {
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
		bottom: 50px;

		// #ifdef APP-PLUS
		bottom: 0;
		// #endif
	}

	.popup {
		display: fixed;
		z-index: 99999;
	}
</style>