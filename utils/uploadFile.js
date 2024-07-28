export default config => {
	const BASE_URL = "http://localhost:8080"
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				const path = res.tempFilePaths[0]
				uni.uploadFile({
					url: BASE_URL + '/music/file/upload',
					filePath: path,
					name: 'file',
					success: (res) => {
						const data = JSON.parse(res.data)
						const img = data.data
						resolve(img)
					},
					fail: (err) => {
						reject(err)
					}
				})
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}