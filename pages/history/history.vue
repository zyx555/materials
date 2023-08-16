<template>
	<view class="container">

    
  
		<view class='item'  v-for="(item, index) in historyPrice" :key = "index">
			<view style='margin: 7px;' >
			<text class="priceName" >{{item.projectName}}</text>
			</view>
			<view style='margin: 9px;'> 
			<text class="time">{{happenTimeFun(item.createdTime)}} </text>
			</view>
			<view class='buttonBox'>
			<button class='check' @click="check(item.fileName,item.fileLocation)">查看</button>
			<button class='download' @click="check(item.fileName,item.fileLocation)">下载</button>
			<button class='delete' @click="dialogToggle('warn',item.id)">删除</button>
			</view>
		</view>
		
		<view>
				<!-- 提示信息弹窗 -->
				<uni-popup ref="message" type="message">
					<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
				</uni-popup>
			</view>
				
			<view>
				<!-- 提示窗示例 -->
				<uni-popup ref="alertDialog" type="dialog">
					<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="确定" title="删除" content="确认删除该报价单吗？" @confirm="dialogConfirm"
						@close="dialogClose"></uni-popup-dialog>
				</uni-popup>
			</view>
	</view>
</template>

<script>

	export default {
		onLoad() {
			this.getHistory()
		},
		onReady() {
			
		},
		onReachBottom() {
					let that = this
					if (that.total <= that.historyPrice.length) {
						uni.showToast({
							title: '已加载全部数据',
							icon: "none"
						});
					} else {
						that.submitDate.pageSize++;
						that.getHistory()
					}
				},
				onPullDownRefresh() {
							const self = this
							const {pageNum,pageSize} = self.submitDate
								uni.request({
									method:'GET',
									url:this.$api+`/api/productChecklist/listHistory?pageNum=${pageNum}&pageSize=${pageSize}`,
									header:{
										'Authorization':"Bearer " + uni.getStorageSync('token'),
									},success(res) {
										console.log(res.data.data)
										self.historyPrice=res.data.data.list
										self.total = res.data.data.length
										uni.stopPullDownRefresh();
									}
								})
						},
		data() {
			return {
				type: 'center',
				msgType: 'success',
				messageText: '删除成功',
				id:null,
				historyPrice:[],
				submitDate: {
									//放你自己的参数
									startDate: '',
									endDate: '',
									pageSize: 12,
									pageNum: 1
								},
								total: 0,//数据总条数
								contractUrl:''
			  }
			},
		
			methods:{ 
				messageToggle(type) {
								this.msgType = type
								this.messageText = `删除成功`
								this.$refs.message.open()
							},
				dialogToggle(type,id) {
					            this.id = id
								this.msgType = type
								this.$refs.alertDialog.open()
							},
				dialogConfirm() {
								console.log('点击确认')
								// this.messageText = `点击确认了 ${this.msgType} 窗口`
								// this.$refs.message.open()
								const self = this
								const id = self.id
								uni.request({
									url:this.$api+`/api/productChecklist/deleteOne?id=${id}`,
									method:'POST',
									header: {
									'Authorization':"Bearer " + uni.getStorageSync('token'),
									},
									success(res) {
										console.log(res)
										self.messageToggle('success')
									    self.getHistory()
									}
								})
							},
				dialogClose() {
								console.log('点击关闭')
							},

		getHistory(){
			const self = this
			const {pageNum,pageSize} = self.submitDate
						uni.request({
							url:`http://47.108.14.168:12500/api/productChecklist/listHistory?pageNum=${pageNum}&pageSize=${pageSize}`,
							method:'GET',
							header: {
							'Authorization':"Bearer " + uni.getStorageSync('token'),
							},
							success(res) {
								console.log(res)
								self.historyPrice = res.data.data.list
								self.total = res.data.data.total
							}
							
						})
						console.log(this.historyPrice)
		},
		check(fileName,fileLocation){
			const self = this
			console.log(fileLocation)
			self.contractUrl = self.$api+fileLocation
			switch (uni.getSystemInfoSync().platform) {
			  case "android":
			    console.log("安卓");
			    self.androidOpenPdf(fileName,self.$api+fileLocation);
			    break;
			  case "ios":
			    console.log("IOS");
			    //这里跳转web-view页面
			    uni.navigateTo({
			      url: `/pages/price/price?contractUrl=${fileLocation}&fileName=${fileName}`,
			    });
			    break;
			  default:
			    self.androidOpenPdf(fileName,self.$api+fileLocation);
			    break;
			}
		},
		deleteOne(id){
			console.log(id)
			const self = this
			const {pageNum,pageSize} = self.submitDate
			// this.dialogToggle('warn',id)
			uni.request({
				url:this.$api+`/api/productChecklist/deleteOne?id=${id}`,
				method:'POST',
				header: {
				'Authorization':"Bearer " + uni.getStorageSync('token'),
				},
				success(res) {
					console.log(res)
					uni.request({
						url:`http://47.108.14.168:12500/api/productChecklist/listHistory?pageNum=${pageNum}&pageSize=${pageSize}`,
						method:'GET',
						header: {
						'Authorization':"Bearer " + uni.getStorageSync('token'),
						},
						success(res) {
							console.log(res)
							self.historyPrice = res.data.data.list
							self.total = res.data.data.total
						}
						
					})
				}
			})
	

		},
		 happenTimeFun(num){//时间戳数据处理
		                 //时间戳为10位需*1000，时间戳为13位的话不需乘1000
						 let date = new Date(num);
		                let y = date.getFullYear();
		                 let MM = date.getMonth() + 1;
		                MM = MM < 10 ? ('0' + MM) : MM;//月补0
		                 let d = date.getDate();
		                 d = d < 10 ? ('0' + d) : d;//天补0
		                 let h = date.getHours();
		                 h = h < 10 ? ('0' + h) : h;//小时补0
		                 let m = date.getMinutes();
		                 m = m < 10 ? ('0' + m) : m;//分钟补0
		                 let s = date.getSeconds();
		                 s = s < 10 ? ('0' + s) : s;//秒补0
		                 return y + '-' + MM + '-' + d + ' ' + h + ':' + m+ ':' + s; //年月日时分秒
		             }, 
							 
		//这里的 url 就是pdf文件的路径，直接调用此方法就可以打开pdf文件
		androidOpenPdf(fileName,url) {
			let filePath =`${wx.env.USER_DATA_PATH}/${fileName}`
 
		  uni.downloadFile({
		    url: url,
			filePath:filePath,
		    success: function (res) {
				console.log('android',res)
		      var filePath = res.filePath;
		      uni.openDocument({
				  showMenu:true,
				  fileType:'pdf',
		          filePath: filePath,
		        success: function (res) {
					
		          console.log("打开文档成功");
		        },
		      });
		    },
		  });
		},
				
			}
		
	
	}
</script>

<style lang="scss">
	.container{
		display: flex;
		justify-content: center;
        flex-wrap: wrap;
	}
	.item{
		width:86%;
		margin-top: 12px;
		border-radius: 6%;
		background-color: #FFFFFF;
	}
	.priceName{
		color: $uni-bg-color;
		padding: 10px;
	}
	.time{
		font-size: 12px;
		color: #A4ADB3;
		padding: 10px;
	}
.buttonBox{
	display: flex;
    justify-content: space-around;
	margin-top: 15px;
	margin-bottom: 10px;
}
.check,.download{
	width: 52px;
	height:24px;
	font-size: 12px;
	line-height: 24px;
	color:#FFFFFF;
	background-color: $uni-bg-color;
	
}
.delete{
	width: 52px;
	height:24px;
	font-size: 12px;
	line-height: 24px;
	color:#FFFFFF;
	background-color: #A4ADB3;
}
</style>
