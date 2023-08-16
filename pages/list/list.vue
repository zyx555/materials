<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view class="wrapper">
		
		<view class='shell' >
			<view class="example-body box">
				<!-- <view></view> -->
					<view @click="toggle('left')">
			<image src='../../static/iconPark-application-two.png'  class="classification" ></image>
			        </view>
			</view>
			<form @submit="formSubmit($event)" style="margin-top: -10px;">
		<input name="name" placeholder="请输入项目名称" class='searchInput'></input>
		<button form-type="submit" class="searchButton" >搜索</button>
		</form>
		</view>
<view style="height: 57px;width: 100%;"></view>
		<view>
					<!-- 普通弹窗 -->
					<uni-popup ref="popup" background-color="#fff" @change="changePopup">
						<view>
						<scroll-view 
						:scroll-top="scrollTop" 
						scroll-y="true" 
						@scroll="scroll" 
						
						:style="{height:'671px',backgroundColor: '#2784FF',}"
						refresher-enabled="true"
						:refresher-triggered="trigger"
						@refresherrefresh="onRefresh"
						show-scrollbar="false"
						>
						<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
								
					<view @click="classification(item.id)" class="classificationItem" v-for="(item, index) in classify" :index="index" :key="index">
								<view  class="classificationNumber">{{index+1}}</view>
								<view class="classficationTitle">{{item.name}}</view>
								<view class="classficationDescription">{{item.description||''}}</view>
								</view>
								<view @click="getServiceFee" class="classificationItem">
									<view  class="classificationNumber" style="background-color: #1FDB0C ; color:white;">{{total}}</view>
									<view class="classficationTitle">服务费</view>
								</view>
									<view style="width:100%;height:25px"></view>
						</view>
					
						   </scroll-view>
						   </view>
					</uni-popup>
					 <view>
					     <view v-if="loadingFlag == 1">数据加载中...</view>
					     <view v-if="loadingFlag == 2">没有更多的数据...</view>
					  </view>
		</view>
		<view>
		<!-- <view  style="height: 62px;"> -->
			<!-- 懒加载、虚拟列表实现 -->
				<!-- 虚拟列表总高度 -->
				<!-- <view :style="{'height': itemHeight*(commoditiesForVirtual.length)+'px', 'position': 'relative'}"> -->
					<!-- 可视渲染区 -->
					<!-- <view :style="{'top': `${top}px`}" style="width: 100%;position:absolute">
			<uni-list v-for="(item,index) in showList"  :key="index">
				<view class="classficationName"><text>{{item.classificationName}}</text></view>
				<uni-list-item clickable='true'>
						
					<template v-slot:body >
					<view style="width: 265px;" @click="dialogToggle('info',index,item.name,item.specification,item.price,item.description)"><text>{{item.specification}}</text></view>
					<view style="width: 265px; font-weight: 300; font-size: 13px;" @click="dialogToggle('info',index,item.name,item.specification,item.price,item.description)"><text>{{item.name}}</text></view>
					</template>
					<template v-slot:footer>
						<view class='commodityPrice'><text>￥{{item.price}}</text></view>
						<image class="slot-image" src="/static/iconPark-shopping-cart-add.png" mode="widthFix" @click="addToPrice(item.id)"></image>
					</template>
					
				</uni-list-item>
				 <view>
				 						<uni-popup ref="alertDialog" type="dialog" >
				 							<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="确定" title="项目详情" @confirm="dialogConfirm" @close="dialogClose">
				 								<form>
				 								<input>项目名称：{{item.name}}</input>
				 								<input>规格类型：{{item.specification}}</input>
				 								<input>项目价格：{{item.price}}</input>
				 								<input>项目描述：{{item.description}}</input>
				 								</form>
				 								</uni-popup-dialog>
				 						</uni-popup>
				 					</view>
			</uni-list>
			</view>
			</view> -->
			
			
			
			
			
			
			
			
			
			<view v-if="serviceFlag==false">
			<view v-for="(item,index) in commodities" :key="index"> 
			
						<view class="classficationName"><text>{{item.classificationName}}</text></view>
		<uni-list v-for="(child,id) in item.childs" :key="id">
	
			<uni-list-item clickable='true' >
		
				<template v-slot:body style="position: absolute;">
					<view style="width: 74%;">
				<view style="width: 90%" @click="dialogToggle('info',id,child.name,child.specification,child.price,child.description)"><text>{{child.specification ||''}}</text></view>
				<view style="width: 90%; font-weight: 300; font-size: 13px;" @click="dialogToggle('info',id,child.name,child.specification,child.price,child.description)"><text>{{child.name}}</text></view>
				</view>
				</template>
				<template v-slot:footer >
					<view >
					<view class='commodityPrice'><text>￥{{child.price}}</text></view>
					<image class="shoppingCar" src="/static/shoppingCar.png" mode="widthFix" @click="addToPrice(child.id)"></image>
				</view>
				</template>
				
			</uni-list-item>
			 <view>
			 						<uni-popup ref="alertDialog" type="dialog" >
			 							<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="确定" title="项目详情" @confirm="dialogConfirm" @close="dialogClose">
			 								<form>
			 								<input>项目名称：{{child.name}}</input>
			 								<input>规格类型：{{child.specification || ''}}</input>
			 								<input>项目价格：{{child.price}}</input>
			 								<input>项目描述：{{child.description || ''}}</input>
			 								</form>
			 								</uni-popup-dialog>
			 						</uni-popup>
			 					</view>
		</uni-list>
    </view>
	</view>
	<view v-if="serviceFlag==true">
		<view class="classficationName">服务费</view>
		<uni-list v-for="(item,index) in serviceFee" :key="index">
			<uni-list-item>
				<template v-slot:header>
							<!-- <view class="slot-box"><image class="slot-image" src="/static/logo.png" mode="widthFix"></image></view> -->
					<view>{{item.serviceChargeName}}</view>
					</template>
				<template v-slot:body >
				
				<view style="margin-left: 55%;position: absolute;color:#FE6104;">{{item.expenseRatio}}%</view>
				</template>
				<template v-slot:footer>
					<!-- <view class='commodityPrice'><text>￥{{child.price}}</text></view> -->
					<image  class="slot-image" src="/static/shoppingCar.png" mode="widthFix" @click="addServiceToPrice(item.id)"></image>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
	
	</view>
	<uni-popup ref="popUp" style="background-color: #515151;" @change="change">
		<view style="background-color: #515151;width: 120px;height: 45px;display: flex;justify-content: center;align-items: center;border-radius: 5px;" :class="{ 'popup-height': type === 'left' || type === 'right' }"><text
				style="color: white;">{{messageText}}</text></view>
	</uni-popup>
	</view>
</template>

<script>
	export default {
		// onReachBottom() {
		// 			let that = this
		// 			if (that.total <= that.commodities.length) {
		// 				uni.showToast({
		// 					title: '已加载全部数据',
		// 					icon: "none"
		// 				});
		// 			} else {
		// 				that.submitDate.page++;
		// 				that.getData()
		// 			}
		// 		},
		onPageScroll(e) {						
					this.scrollTopCommodity = e.scrollTop			
					// this.getShowList()			
				},
				// onPullDownRefresh() {
				// 	const self = this
				// 		uni.request({
				// 			method:'GET',
				// 			url:self.$api+'/api/productBasic/listByClassificationIdAndStatus',
				// 			header:{
				// 				'Authorization':"Bearer " + uni.getStorageSync('token'),
				// 			},
				// 			success: (res) => {
				// 				console.log(res)
				// 				self.commodities = res.data.data
				// 				uni.stopPullDownRefresh();
				// 				} 
				// 			})
						
				// },
			onShow() {
				const self = this
			
				uni.request({
					method:'GET',
					url:this.$api+'/api/productChecklist/list',
					header: {
					'Authorization':"Bearer " + uni.getStorageSync('token'),
					},
					success(res) {
						console.log(res)
						self.shoppingGoods = res.data.data
						// let num = uni.getStorageSync('shoppingNumber')
						let num = 0
						res.data.data.map(item => {
							num+=item.productCount
						})
						uni.setStorage({
							key:'shoppingNumber',
							data:num
						})
						uni.setTabBarBadge({
							index:1,
							text:num.toString()
						})

					}
				})
				uni.getStorage({
					key:'token',
					success() {
						self.getData()
					},
					fail() {
						uni.navigateTo({
						  url:'/pages/login/login'	
						})
					}
				})
					// this.getShowList()
				
				},

		data() {
			return {
				id:34,
				loadingFlag:0,
				trigger:false,
				type: 'center',
				msgType: 'success',
				// msg:'success',
				Type:'info',
				messageText: '这是一条成功提示',
				value: '',
				show:false,
				scrollTop: 0,
				old: {
						scrollTop: 0
				},
				showList: [],  //可视区域显示的数据
				itemHeight: 132,//每条数据所占高度
				showNum: 8,  //可视区域显示的最大条数
				top: 0, //偏移量
				scrollTopCommodity: 0,  //卷起的高度
				startIndex: 0,  //可视区域第一条数据的索引
				endIndex: 0,
				pageHeight:671,
                dynamicList: [],
				classify: [],
				serviceFee:[],
				serviceFlag:false,
				commoditiesForVirtual:[],
				commodities:[],
				shoppingGoods:[],
				submitDate: {
						startDate: '',
						endDate: '',
						page: 1,
						limit: 5
					},
				total:0,
				name:'',
				isRefresh: false,
				isStart: false,
			};
		},
		methods:{
			getData(){
				const self = this
				uni.showLoading({
						title: '加载中'
					})
				uni.request({
					method:"GET",
					url: this.$api+'/api/productBasic/listByClassificationIdAndStatus',
					header: {
					'Authorization':"Bearer " + uni.getStorageSync('token'),
					},
					data:{
						classificationId:self.id
					},
					success: (res) => {
						console.log(res)
						self.commoditiesForVirtual = res.data.data
						const arr = []
                        res.data.data.forEach(item=>{
							    const parent = arr.find(cur => cur.classificationId === item.classificationId)
							    if (parent) {
							        parent.childs.push(item)
							    } else {
							        const obj = {
							            classificationName: item.classificationName,
							            classificationId: item.classificationId,
							            childs: [item]
							        }
							        arr.push(obj)
							    }
						})
						self.commodities = arr
						console.log(self.commodities)
						uni.hideLoading()
					 } 
				})
			},
			//懒加载。虚拟列表
				// getShowList(){
					
				// this.startIndex = Math.floor(this.scrollTopCommodity/this.itemHeight);   //可视区域第一条数据的索引
				// this.endIndex = this.startIndex + this.showNum;   //可视区域最后一条数据的后面那条数据的索引
				// this.showList = this.commoditiesForVirtual.slice(this.startIndex, this.endIndex)  //可视区域显示的数据，即最后要渲染的数据。实际的数据索引是从this.startIndex到this.endIndex-1
				// this.top = this.scrollTopCommodity - (this.scrollTopCommodity % this.itemHeight);  //在这需要获得一个可以被itemHeight整除的数来作为item的偏移量，这样随机滑动时第一条数据都是完整显示的
				// console.log(this.showList)
				// },
				// scrollCommodity(){
				// 	const self = this
				// 	// 利用uniapp提供的接口获取可视区域的高度和滚动高度
				// 	let query=uni.createSelectorQuery()
				// 	let container=query.select('.container');
				// 	container.fields({
				// 		// rect:true,   //是否返回节点布局位置信息{left,top,right,bottom}
				// 		size:true,  //是否返回节点尺寸信息{width，height}
				// 		scrollOffset:true //是否返回节点滚动信息{scrollLeft,scrollTop}
				// 	},(res)=>{
				// 		console.log(res)
				// 		self.scrollTopCommodity=res.scrollTop
				// 		self.contentHeight=res.height
				// 		self.getShowList();//因为所在函数是异步
				// 	}).exec()
				// },
			change(e) {
						console.log('当前模式：' + e.type + ',状态：' + e.show);
						},
			messageToggle(self,messageText,type) {
				// const self = this
							self.type = type
							self.messageText = messageText
							self.$refs.popUp.open()
							setTimeout(()=>{
								self.$refs.popUp.close()
							},1300)
						},
			dialogConfirm() {
							console.log('点击确认')
							// this.messageText = `点击确认了 ${this.msgType} 窗口`
							// this.$refs.message.open()
						},
			dialogClose() {
							console.log('点击关闭')
						},	
			dialogToggle(type,id,name,specification,price,description) {
							this.Type = type
							this.$refs.alertDialog[id].open()
							console.log(id,name,specification,price,description)
						},
			changeGrid(e) {
							let {index} = e.detail
							this.list[index].badge && this.list[index].badge++
							uni.showToast({
								title: `点击第${index+1}个宫格`,
								icon: 'none'
							})
						},
						
			classification(id){
							const self = this
							self.id = id
							self.serviceFlag = false
							self.getData(self.id)
							this.$refs.popup.close()
						},
			changePopup(e) {
							console.log('当前模式：' + e.type + ',状态：' + e.show);
							this.show=e.show
						},
			getServiceFee(){
				const self = this
				self.serviceFlag = true
							uni.request({
								method:'GET',
								url:this.$api+'/api/serviceCharge/listAll',
								header:{
								  'Authorization':"Bearer " + uni.getStorageSync('token'),
								},
								success(res) {
									console.log('``````',res)
									self.commodities = [res.data.data]
									console.log(self.commodities)
									uni.hideLoading()
									self.serviceFee = res.data.data
									self.commodities = res.data.data
									// self.total +=1
									self.$refs.popup.close()
								}
							})
						},
			toggle(type) {
				const self = this
				this.type=type
					// this.type = type
					// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
					this.$refs.popup.open(this.type)
					uni.request({
						method:'GET',
						url:this.$api+'/api/productClassification/listAll',
						header:{
							'Authorization':"Bearer " + uni.getStorageSync('token'),
						},success(res) {
							console.log(res.data.data)
							self.classify=res.data.data
							self.total = res.data.data.length+1
						}
					})
				},
			  onRefresh() {
				  const self = this
				  self.trigger = true;
				  // emit("loadAllData");
				  //此处使用了定时器模拟 网络请求，应该在网络请求成功后 trigger.value = false;
				  uni.request({
				  	method:'GET',
				  	url:this.$api+'/api/productClassification/listAll',
				  	header:{
				  		'Authorization':"Bearer " + uni.getStorageSync('token'),
				  	},success(res) {
						self.trigger = false;
				  		console.log(res.data.data)
				  		self.classify=res.data.data
				  		self.total = res.data.data.length
						uni.stopPullDownRefresh()
				  	}
				  })
				},
			scroll(e) {
				// console.log(e)
							this.old.scrollTop = e.detail.scrollTop
							// this.pageHeight = e.detail.scrollHeight
						},
			 formSubmit(e){
				 const self = this
				 uni.showLoading({
				 		title: '加载中'
				 	})
				 console.log(e.target.value.name)
				 this.name=e.target.value.name
				
				uni.request({
					method:"GET",
					url: this.$api+'/api/productBasic/listByClassificationIdAndStatus',
					data:{
						name:this.name,
					},
					header: {
					'Authorization':"Bearer " + uni.getStorageSync('token'),
					},
					success: (res) => {
						self.commoditiesForVirtual = res.data.data
						const arr = []
						res.data.data.forEach(item=>{
							    const parent = arr.find(cur => cur.classificationId === item.classificationId)
							    if (parent) {
							        parent.childs.push(item)
							    } else {
							        const obj = {
							            classificationName: item.classificationName,
							            classificationId: item.classificationId,
							            childs: [item]
							        }
							        arr.push(obj)
							    }
						})
						self.commodities = arr
						console.log(self.commodities)
						uni.hideLoading()
						e.target.value=''
					 } 
				})
			},
		addToPrice(id){
			// this.$refs.alertDialog[id].close()
			const self = this
			console.log(id)
			uni.request({
				url:this.$api+`/api/productChecklist/addOne/${id}`,
				method:'POST',
				header: {
				'Authorization':"Bearer " + uni.getStorageSync('token'),
				},
				success(res) {
					console.log(res)		
					const num = uni.getStorageSync('shoppingNumber')
					uni.setStorage({
						key:'shoppingNumber',
						data: num+1
					})
					uni.setTabBarBadge({
						index:1,
						text:(num+1).toString()
					})
					self.messageToggle(self,'加购成功','success')

				}
			})
		},
      addServiceToPrice(id){
		  const self = this
		  console.log(id)
		  uni.request({
		  	url:this.$api+`/api/serviceCharge/addTo/${id}`,
			method:'POST',
			header: {
			'Authorization':"Bearer " + uni.getStorageSync('token'),
			},
			success(res) {
				console.log(res)
				if(res.data.code === 200){
					self.messageToggle(self,'加购成功','success')
				}else if(res.data.code ===500){
					self.messageToggle(self,'同一服务费只能加购一次','error')
				}else{
					self.messageToggle(self,'失败','error')
				}
				
			}
		  })
	  },
		}
	
		
	}
</script>

<style lang="scss">
	.container{
			width: 100%;
			height: 100vh;
	        /*原生一定得有这个overflow的hidden效果,此处用了scroll-view所以不需要*/
			/*overflow:auto;*/
		}
	.shell{
		position: fixed;
			left: 0;
			right: 0;
			top: 0;
			z-index:99 ;	
	}
	.shell{
		height: 57px;
		display: flex;
		justify-content: center;
	    align-items: center;
		background-color: #FFFFFF;
		box-shadow: 0px 4px 9px 0px #BBBBBB;
	    margin-bottom: 10px;
		 flex: 0 0 100rpx;
	}
	@mixin flex {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
		}
	
	@mixin height {
			/* #ifndef APP-NVUE */
			height: 100%;
			/* #endif */
			/* #ifdef APP-NVUE */
			flex: 1;
			/* #endif */
		}
	
	.box {
			@include flex;
		}
    .example-body {
		background-color: #fff;
	    padding: 10px 20px;
	    margin-left: -28px;
	}
	.popup-content {
			@include flex;
			justify-content: center;
			flex-wrap: wrap;
			padding: 15px;
			height: 50px;
			background-color: $uni-bg-color;
		}
	.popup-height {
			@include height;
				width: 200px;
		}
	.classificationItem{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-left: 17px;
			// height: 70px;
			margin-top: 14px;
			margin-bottom: 14px;
			// height: 132px;
			width: 80px;
	}
    .classificationNumber{
		width: 50px;
		height:50px;
		border-radius: 50%;
		font-size: 28px;
		line-height: 50px;
		text-align: center;
		background-color: #FFFFFF;
	}
	.classficationTitle{
		// width: 56px;
		// height:20px;
		font-size: 14px;
		color:#F8F8F9;
		text-align: center;
		margin: 5px 0px;
	}
	.classficationDescription{
		width: 80px;
		// height: 35px;
		font-size: 12px;
		text-align: center;
		color: #F8F8F9;
		line-height: 15px;
	}
		.image {
			width: 25px;
			height: 25px;
		}
	.grid-item-box {
			flex: 1;
			// position: relative;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 15px 0;
		}
.grid-item-box-row {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.grid-dot {
		position: absolute;
		top: 5px;
		right: 15px;
	}

	.classification{
		width: 24px;
		height: 24px;
		background-color: $uni-bg-color;
	}
	.searchInput{
		width: 180px;
		height: 30px;
		font-size: 14px;
		border: 1px  solid  #BBBBBB ;
		border-radius: 6px;
		padding-left: 10px;
	}
    .searchButton{
        width: 51px;
		height:22px;
		font-size: 14px;
		line-height: 22px;
    	background-color:$uni-bg-color;
		margin-left: 203px;
		margin-top: -28px;
		padding: 0;
		color:#FFFFFF;
    }
    .slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
 .shoppingCar{
	 width: 25px;
	 height: 25px;
	 
 }
	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		// margin: 0 auto;
		margin-right: 10px;
		margin-left: auto;
		width: 25px;
		height:25px;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		color: #4cd964;
		margin-right: 10px;
	}
.uni-list-item{
        width: 90%;	
		box-shadow: 0px 1px 4px black;
	    margin: 30px auto;
}
.commodityPrice{
	font-size: 14px;
	color:#FE6104;
}
.classficationName{
	font-size: 16px;
	    padding-left: 19px;
	    margin-top: 10px;

}
</style>
