export default config => {
	const BASE_URL = "https://backend.recha.us.kg"
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				uni.showLoading({
					title: '图片上传中'
				})
				const path = res.tempFilePaths[0]
				uni.uploadFile({
					url: BASE_URL + '/music/file/upload',
					filePath: path,
					name: 'file',
					success: (res) => {
						const data = JSON.parse(res.data)
						const img = data.data
						resolve(img)
						uni.hideLoading()
					},
					fail: (err) => {
						reject(err)
						uni.hideLoading()
					}
				})
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}