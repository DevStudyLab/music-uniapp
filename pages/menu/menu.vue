<template>
	<view v-if="menuInfo">
		<uni-nav-bar v-if="username===menuInfo.user.username" title="首页" left-icon="left" leftText="返回"
			@clickLeft="toBack" rightText="设置" @clickRight="setHandler" background-color="#2979ff" color="#fff" fixed
			status-bar :border="false" />
		<uni-nav-bar v-else title="首页" left-icon="left" leftText="返回" @clickLeft="toBack" background-color="#2979ff"
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
					console.log(res);
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
		height: 100%;

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
				width: calc(100% - 60px);

				.tag {
					float: right;

					.icon-gengduo {
						font-size: 40upx;
						position: relative;
						top: 20upx;
						left: 40upx;
					}
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

	.bottom {
		z-index: 999999;
		width: 100%;
		position: fixed;
		bottom: 0;
	}

	.set {
		z-index: 1000000;

		.setList {
			padding: 20px 50px;
			text-align: center;

			p {
				margin: 26upx 0;
			}
		}
	}

	.add {
		z-index: 1000000;
	}
</style>