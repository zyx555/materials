import Vue from 'vue'
import axios from 'axios'

 axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

 const service = axios.create({
 	baseURL: "http://47.108.14.168:12500",
 	timeout: 6000,
 })

// 请求拦截
service.interceptors.request.use(config => {
		// 非登录接口添加token
		if (config["url"].indexOf("login") < 0) {
			config.headers['token'] = uni.getStorageSync('token');
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	});

// 响应拦截
service.interceptors.response.use(res => {
	if (res.status == 200) {
		// 请求成功后设置token
		if (res.data.code == 100) {
			uni.setStorageSync('token', res.header["token"]);
		}
		return res.data;
	} else {
		return Promise.reject(res.data.msg);
	}
});


// 自定义适配器 ， 适配uniapp语法
axios.defaults.adapter = function(config) {
	return new Promise((resolve, reject) => {
		let settle = require('axios/lib/core/settle');
		let buildURL = require('axios/lib/helpers/buildURL');
		let buildFullPath = require('axios/lib/core/buildFullPath');
		let fullurl = buildFullPath(config.baseURL, config.url);
		uni.request({
			method: config.method.toUpperCase(),
			url: buildURL(fullurl, config.params, config.paramsSerializer),
			header: config.headers,
			data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};
				settle(resolve, reject, response);
			},
		});
	})
}
export default service
