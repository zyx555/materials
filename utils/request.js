const BASE_URL = "http://47.108.14.168:12500"//接口地址
http.interceptors.request.use(
(request) => {
request.data = JSON.parse(request.data)
}
)
export const http = (options) => {
	return new Promise((resolve,reject) => {
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: JSON.parse(options.data) || {},
			header: {Authorization:'Bearer ' + uni.getStorageSync('token')},
			success: (res) => {
					if (res == '') {
					return uni.showToast({
						icon: 'loading',
						title:'获取数据失败'
					})
				}
				resolve(res)
			},
			fail: (err) => {
				return uni.showToast({
					icon: 'loading',
					title:'请求失败'
				})
				reject(err)
			}
		})
	})
}
