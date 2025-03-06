<template>
	<view v-if="menuInfo" class="menu-container">
		<music-background type="waves" containerId="music-background" />
		<uni-nav-bar v-if="username === menuInfo.user.username" title="音渊" left-icon="left" leftText="返回"
			@clickLeft="toBack" rightText="设置" @clickRight="setHandler" background-color="#3883FF" color="#fff" fixed
			status-bar :border="false" />
		<uni-nav-bar v-else title="音渊" left-icon="left" leftText="返回" @clickLeft="toBack" background-color="#3883FF"
			color="#fff" fixed status-bar :border="false" />

		<view class="top">
			<image class="img" :src="menuInfo.image"></image>
			<view class="right">
				<view class="time">{{ menuInfo.createTime }}</view>
				<view class="title"><strong>{{ menuInfo.name }}</strong></view>
				<view class="text">创建者：{{ menuInfo.user.username }}</view>
				<uni-tooltip class="item" :content="menuInfo.description" placement="bottom">
					<view class="text description">描述：{{ menuInfo.description }}</view>
				</uni-tooltip>
			</view>
		</view>

		<view class="list">
			<view class="hotSongList">
				<view class="item" v-for="(item, index) in songList" :key="index" @click="setMusic(index)">
					<image class="img" src="../../static/player.jpeg"></image>
					<view class="rightBox">
						<view class="tag">
							<uni-tag :text="item.type" type="primary" size="small" />
							<view v-if="username === menuInfo.user.username" class="iconfont icon-gengduo"
								@click.stop="deleteHandler(item)"></view>
						</view>
						<p class="name"><strong>{{ item.name }}</strong></p>
						<p>歌手：{{ item.singer }}</p>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 100upx; width: 100%;"></view>

		<uni-popup ref="popup" background-color="#fff">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确认" title="提示"
				:content="'确定从' + menuInfo.name + '中删除' + deleteItem.name" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>

		<uni-popup class="set" ref="set" background-color="#fff" type="center">
			<view class="setList">
				<h4>操作</h4>
				<p @click="deleteMenu">删除歌单</p>
				<p @click="addSong">添加歌曲</p>
			</view>
		</uni-popup>

		<uni-popup class="add" ref="add" background-color="#fff" type="center">
			<uni-search-bar v-model='searchVal' :focus="false" placeholder="输入想听的歌名" class="custom-search" />
			<scroll-view scroll-y="true" style="height: 60vh;">
				<view class="hotSongList" style="width: 550upx;">
					<view class="item" v-for="(item, index) in allSong" :key="index" @click="add(item.id)">
						<image class="img" src="../../static/player.jpeg"></image>
						<view class="rightBox">
							<uni-tag class="tag" :text="item.type" type="primary" size="small" />
							<p class="name"><strong>{{ item.name }}</strong></p>
							<p>歌手：{{ item.singer }}</p>
						</view>
					</view>
				</view>
			</scroll-view>
		</uni-popup>

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
				username: null,
				menuList: null,
				menuInfo: null,
				songList: [],
				song: {
					name: null,
					singer: null,
					content: null
				},
				deleteItem: {
					id: null,
					name: null
				},
				searchVal: null,
				allSong: []
			};
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
					this.allSong = res.data.list
				})
			}
		},
		onLoad(data) {
			this.username = uni.getStorageSync('user').username
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
					this.songList = res.data.list[0].songList
				})
			},
			getAllSong() {
				request({
					url: 'music/song',
					method: 'get',
					data: {
						name: this.searchVal
					}
				}).then(res => {
					this.allSong = res.data.list
				})
			},
			toBack() {
				uni.navigateBack()
			},
			setMusic(index) {
				this.song = this.songList[index]
				uni.setStorageSync('song', this.song)
				uni.$emit('update', true)
			},
			deleteHandler(item) {
				this.deleteItem = item
				this.$refs.popup.open()
			},
			dialogConfirm() {
				request({
					url: `music/menu/detail/${this.deleteItem.id}?menuId=${this.menuInfo.id}`,
					method: 'DELETE'
				}).then(res => {
					this.getMenu()
				})
			},
			setHandler() {
				this.$refs.set.open()
			},
			deleteMenu() {
				request({
					url: 'music/menu/' + this.menuInfo.id,
					method: 'DELETE'
				}).then(res => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				})
			},
			addSong() {
				this.getAllSong()
				this.$refs.set.close()
				this.$refs.add.open()
			},
			add(id) {
				request({
					url: `music/menu/detail/${id}?menuId=${this.menuInfo.id}`,
					method: 'POST'
				}).then(res => {
					this.$refs.add.close()
					this.getMenu()
				})
			}
		}
	}
</script>

<style lang="scss">
	.menu-container {
		position: relative;
		min-height: 100vh;
		background: transparent;
		overflow: hidden;

		@keyframes floatNote {
			0% {
				transform: translate(0, 0) rotate(0deg);
				opacity: 0;
			}

			50% {
				opacity: 0.6;
			}

			100% {
				transform: translate(var(--tx), -100vh) rotate(360deg);
				opacity: 0;
			}
		}

		@keyframes twinkle {
			0% {
				transform: scale(1);
				opacity: 0.2;
			}

			50% {
				transform: scale(1.2);
				opacity: 0.8;
			}

			100% {
				transform: scale(1);
				opacity: 0.2;
			}
		}

		&::before,
		&::after {
			content: '♪';
			position: absolute;
			font-size: 24px;
			color: rgba(41, 121, 255, 0.6);
			animation: floatNote 8s linear infinite;
			--tx: 100px;
		}

		&::after {
			content: '✦';
			right: 20%;
			animation: twinkle 3s ease-in-out infinite;
			font-size: 16px;
		}

		.star {
			position: absolute;
			width: 2px;
			height: 2px;
			background: #2979ff;
			border-radius: 50%;
			opacity: 0.2;
			animation: twinkle 2s ease-in-out infinite;

			&:nth-child(2n) {
				animation-delay: 0.5s;
			}

			&:nth-child(3n) {
				animation-delay: 1s;
			}
		}

		.top,
		.list {
			position: relative;
			z-index: 1;
			background: rgba(255, 255, 255, 0.8);
			backdrop-filter: blur(10px);
			border-radius: 12px;
			margin: 10px;
			padding: 15px;
		}
	}

	.setText {
		position: absolute;
		top: 0px;
		right: 15px;
		line-height: 45px;
		font-size: 14px;
		z-index: 9999;

		// #ifdef APP-PLUS
		top: 30px;
		// #endif
	}

	.top {
		background-image: linear-gradient(135deg, rgba(41, 121, 255, 0.15), rgba(255, 255, 255, 0.1));
		box-shadow: 0 8upx 32upx rgba(41, 121, 255, 0.1);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 30upx 0;
		display: flex;
		margin-bottom: 30upx;

		.img {
			margin: 20upx;
			width: 200upx;
			height: 200upx;
			border-radius: 16upx;
			box-shadow: $music-shadow-card;
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.98);
			}
		}

		.right {
			flex: 1;
			padding: 20upx 30upx 20upx 0;

			.time {
				float: right;
				color: $uni-text-color-grey;
				font-size: 24upx;
			}

			.title {
				strong {
					font-size: 36upx;
					color: $uni-text-color;
					margin-bottom: 16upx;
					display: block;
				}
			}

			.text {
				font-size: 26upx;
				color: $uni-text-color-grey;
				margin-top: 12upx;
				line-height: 1.6;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.description {
				color: $uni-text-color-grey;
			}
		}
	}

	.hotSongList {
		.item {
			position: relative;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				top: -50%;
				left: -50%;
				width: 200%;
				height: 200%;
				background: linear-gradient(45deg, transparent, rgba(41, 121, 255, 0.1), transparent);
				transform: rotate(45deg);
				animation: shine 3s infinite;
				pointer-events: none;
			}

			@keyframes shine {
				0% {
					transform: translateX(-100%) rotate(45deg);
				}

				100% {
					transform: translateX(100%) rotate(45deg);
				}
			}

			display: flex;
			align-items: center;
			padding: 20upx;
			margin-bottom: 20upx;
			background: #fff;
			border-radius: 12upx;
			box-shadow: $music-shadow-card;
			transition: all 0.2s;
			border-left: 4upx solid $uni-color-primary;

			&:active {
				transform: scale(0.98);
				background: $uni-bg-color-hover;
			}

			.img {
				width: 100upx;
				height: 100upx;
				border-radius: 12upx;
				margin-right: 24upx;
				box-shadow: 0 4upx 8upx rgba(0, 0, 0, 0.1);
				object-fit: cover;
			}

			.rightBox {
				flex: 1;
				min-width: 0;
				position: relative;
				padding-right: 120upx;

				.tag {
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					display: flex;
					align-items: center;

					.icon-gengduo {
						font-size: 40upx;
						color: $uni-text-color-grey;
						margin-left: 20upx;
						padding: 10upx;
						transition: all 0.3s ease;

						&:active {
							transform: scale(0.9) rotate(90deg);
							color: $uni-color-primary;
						}
					}
				}

				.name {
					font-size: 32upx;
					color: $uni-text-color;
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
					color: $uni-text-color-grey;
					margin: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		.item:last-child {
			margin: 0;
		}
	}

	.set {
		.setList {
			padding: 40upx;
			text-align: center;
			background: #fff;
			border-radius: 20upx;

			h4 {
				font-size: 32upx;
				color: $uni-text-color;
				margin-bottom: 30upx;
			}

			p {
				font-size: 28upx;
				color: $uni-text-color-grey;
				padding: 20upx 0;
				transition: all 0.3s ease;

				&:active {
					color: $uni-color-primary;
					transform: scale(0.98);
				}
			}
		}
	}

	.add {
		::v-deep .uni-searchbar {
			padding: 20upx;
			background: #fff;
		}

		.hotSongList {
			padding: 0 20upx;

			.item {
				margin-bottom: 16upx;
				padding: 16upx;
			}
		}
	}

	.bottom {
		z-index: 999999;
		width: 100%;
		position: fixed;
		bottom: 0;
	}
</style>