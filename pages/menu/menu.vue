<template>
	<view v-if="menuInfo">
		<uni-nav-bar v-if="username===menuInfo.user.username" title="音渊" left-icon="left" leftText="返回"
			@clickLeft="toBack" rightText="设置" @clickRight="setHandler" background-color="#2979ff" color="#fff" fixed
			status-bar :border="false" />
		<uni-nav-bar v-else title="音渊" left-icon="left" leftText="返回" @clickLeft="toBack" background-color="#2979ff"
			color="#fff" fixed status-bar :border="false" />

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
						<view class="tag">
							<uni-tag :text="item.type" type="primary" size="small" />
							<view v-if="username===menuInfo.user.username" class="iconfont icon-gengduo"
								@click.stop="deleteHandler(item)"></view>
						</view>
						<p class="name"><strong>{{item.name}}</strong></p>
						<p>歌手：{{item.singer}}</p>
					</view>
				</view>
			</view>
		</view>

		<uni-popup ref="popup" background-color="#fff">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确认" title="提示"
				:content="'确定从'+menuInfo.name+'中删除'+deleteItem.name" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>

		<uni-popup class="set" ref="set" background-color="#fff" type="center">
			<view class="setList">
				<h4>操作</h4>
				<p @click="deleteMenu">删除歌单</p>
				<p @click="addSong">添加歌曲</p>
			</view>
		</uni-popup>

		<uni-popup class="add" ref="add" background-color="#fff" type="center">
			<uni-search-bar v-model='searchVal' :focus="false" placeholder="输入想听的歌名" />
			<scroll-view scroll-y="true" style="height: 60vh;">
				<view class="hotSongList" style="width: 550upx;">
					<view class="item" v-for="(item,index) in allSong" :key="index" @click="add(item.id)">
						<image class="img" src="../../static/player.jpeg"></image>
						<view class="rightBox">
							<uni-tag class="tag" :text="item.type" type="primary" size="small" />
							<p class="name"><strong>{{item.name}}</strong></p>
							<p>歌手：{{item.singer}}</p>
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
		background-image: linear-gradient(to bottom, rgba(41, 121, 255, 0.1), transparent);
		padding: 30upx 0;
		display: flex;
		margin-bottom: 30upx;

		.img {
			margin: 20upx;
			width: 200upx;
			height: 200upx;
			border-radius: 16upx;
			box-shadow: 0 8upx 24upx rgba(0, 0, 0, 0.15);
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
				color: #999;
				font-size: 24upx;
			}

			strong {
				font-size: 36upx;
				color: #333;
				margin-bottom: 16upx;
				display: block;
			}

			.text {
				font-size: 26upx;
				color: #666;
				margin-top: 12upx;
				line-height: 1.6;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
	}

	.hotSongList {
		padding: 20upx;
		padding-bottom: 100upx;

		.item {
			display: flex;
			align-items: center;
			padding: 20upx;
			margin-bottom: 20upx;
			background: #fff;
			border-radius: 12upx;
			box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.05);
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
				box-shadow: 0 4upx 8upx rgba(0, 0, 0, 0.1);
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
						color: #999;
						margin-left: 20upx;
						padding: 10upx;
						transition: all 0.3s ease;

						&:active {
							transform: scale(0.9) rotate(90deg);
							color: #2979ff;
						}
					}
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
					margin: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
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
				color: #333;
				margin-bottom: 30upx;
			}

			p {
				font-size: 28upx;
				color: #666;
				padding: 20upx 0;
				transition: all 0.3s ease;

				&:active {
					color: #2979ff;
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