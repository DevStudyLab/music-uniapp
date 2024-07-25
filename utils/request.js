export default config => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: "http://localhost:8080/" + config.url,
			method: config.method,
			data: config.data,
			timeout: 20000,
			success: (res) => {
				if (res.data.code === 200) {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}