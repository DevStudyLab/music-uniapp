<template>
	<view>
		<uni-nav-bar title="音渊" background-color="#2979ff" color="#fff" status-bar :border="false" fixed />
		<uni-search-bar v-model='searchVal' :focus="false" placeholder="输入想听的歌名" />

		<view v-if="!searchVal">
			<swiper class="block" circular indicator-dots autoplay :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in 4" :key="index">
					<image class="img" :src="'../../static/banner (' + (index + 1) + ').jpg'"></image>
				</swiper-item>
			</swiper>

			<uni-section title="歌单列表"></uni-section>
			<div class="menu-scroll-container">
				<div v-for="(item, index) in menuList" :key="index" class="menu-item" @click="toMenu(item.id)">
					<img :src="item.image" class="menu-image" alt="Menu Item Image" />
					<div class="menu-info">
						<p class="menu-name">{{ item.name }}</p>
					</div>
				</div>
			</div>

			<uni-section title="热门歌曲"></uni-section>
			<view class="hotSongList">
				<view class="item" v-for="(item, index) in hotSongList" :key="index" @click="setMusic(index)">
					<image class="img" src="../../static/player.jpeg"></image>
					<view class="rightBox">
						<uni-tag class="tag" :text="item.type" type="primary" size="small" />
						<p class="name"><strong>{{ item.name }}</strong></p>
						<p>歌手：{{ item.singer }}</p>
					</view>
				</view>
			</view>

			<view style="height: 80upx;"></view>
		</view>
		<view v-else>
			<view class="hotSongList">
				<view class="item" v-for="(item, index) in songList" :key="index" @click="setMusic(index)">
					<image class="img" src="../../static/player.jpeg"></image>
					<view class="rightBox">
						<uni-tag class="tag" :text="item.type" type="primary" size="small" />
						<p class="name"><strong>{{ item.name }}</strong></p>
						<p>歌手：{{ item.singer }}</p>
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
			this.song = this.searchVal ? this.songList[index] : this.hotSongList[index]
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
	padding: 20upx;

	&::-webkit-scrollbar {
		display: none;
	}

	.menu-item {
		flex: 0 0 auto;
		width: 220upx;
		margin-right: 20upx;
		position: relative;
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.95);
		}

		.menu-image {
			width: 220upx;
			height: 220upx;
			object-fit: cover;
			border-radius: 16upx;
			box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.15);
		}

		.menu-info {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 30upx 16upx 16upx;
			border-radius: 0 0 16upx 16upx;
			background: linear-gradient(to top,
					rgba(0, 0, 0, 0.8) 0%,
					rgba(0, 0, 0, 0.4) 60%,
					rgba(0, 0, 0, 0) 100%);

			.menu-name {
				text-align: center;
				font-size: 26upx;
				color: #ffffff;
				font-weight: 500;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-shadow: 0 2upx 4upx rgba(0, 0, 0, 0.3);
			}
		}

		&:hover {
			.menu-image {
				transform: translateY(-4upx);
				box-shadow: 0 8upx 16upx rgba(0, 0, 0, 0.2);
			}
		}

		&:last-child {
			margin-right: 40upx;
		}
	}
}

.block {
	margin: 20upx;
	border-radius: 16upx;
	overflow: hidden;
	height: 300upx;
	box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.1);

	.img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	::v-deep .uni-swiper-dots {
		bottom: 20upx;

		.uni-swiper-dot {
			width: 12upx;
			height: 12upx;
			border-radius: 6upx;
			background: rgba(255, 255, 255, 0.6);
			transition: all 0.3s;

			&.uni-swiper-dot-active {
				width: 24upx;
				background: #fff;
			}
		}
	}
}

.hotSongList {
	padding: 20upx;

	.item {
		display: flex;
		align-items: center;
		padding: 20upx;
		margin-bottom: 10upx;
		background: #fff;
		border-radius: 12upx;
		transition: all 0.2s;

		&:active {
			transform: scale(0.98);
			background: #f8f8f8;
		}

		.img {
			width: 100upx;
			height: 100upx;
			border-radius: 12upx;
			margin-right: 24upx;
			flex-shrink: 0;
			box-shadow: 0 4upx 8upx rgba(0, 0, 0, 0.1);
		}

		.rightBox {
			flex: 1;
			min-width: 0;
			position: relative;
			padding-right: 100upx;

			.tag {
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}

			.name {
				font-size: 32upx;
				color: #333;
				margin-bottom: 8upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				strong {
					font-weight: 600;
				}
			}

			p {
				font-size: 24upx;
				color: #999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin: 0;
			}
		}

		&:not(:last-child) {
			border-bottom: 1upx solid #f0f0f0;
		}
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

::v-deep .uni-section {
	padding: 10upx 15upx 0upx;

	.uni-section-header {
		position: relative;
		display: flex;
		align-items: center;
		margin-bottom: 12upx;

		.uni-section__content-title {
			font-size: 32upx;
			font-weight: 700;
			color: #333;
			position: relative;
			padding-left: 20upx;
			letter-spacing: 1upx;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 6upx;
				height: 28upx;
				border-radius: 3upx;
				background: linear-gradient(to bottom, #1c6fee, #4785ee);
			}
		}

		&::after {
			content: '';
			position: absolute;
			left: 20upx;
			bottom: -8upx;
			width: 50upx;
			height: 3upx;
			background: linear-gradient(to right, #2979ff, transparent);
			border-radius: 2upx;
		}
	}

	.uni-section-content {
		margin-top: 12upx;
	}
}

::v-deep .uni-section+.menu-scroll-container {
	margin-top: 12upx;
}

::v-deep .uni-section+.hotSongList {
	margin-top: 12upx;
}

::v-deep .uni-section:hover {
	.uni-section__content-title {
		&::before {
			background: linear-gradient(to bottom, #1c6fee, #4785ee);
		}
	}

	.uni-section-header::after {
		width: 80upx;
		transition: width 0.3s ease;
	}
}

.bottom {
	z-index: 99999;
	width: 100%;
	position: fixed;
	bottom: 100upx;

	// #ifdef APP-PLUS
	bottom: 0;
	// #endif
}

.popup {
	display: fixed;
	z-index: 99999;
}
</style>