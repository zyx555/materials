<template>
	<view>
		 <!--页面底部区域  -->
		 <view>
			 
		 </view>
		 <view class="serviceFee">
		 <uni-list v-for="(item,index) in serviceFeeChecked" :key="index">
		 				  <uni-list-item>
		 					  <template v-slot:header >
		 					  			<!-- <view class="slot-box"><image class="slot-image" src="/static/logo.png" mode="widthFix"></image></view> -->
		 					  	<view class="serviceTitle">{{item.serviceChargeName}}({{item.expenseRatio}}%)</view>
		 					  	</template>
								 <template v-slot:body >
									 <view class="serviceTotalPrice" style="color: #FE6104;margin-left: 60%;position: absolute;">
									 	+￥{{(totalPrice*item.expenseRatio/100).toFixed(2)}}
									 	<!-- +￥{{totalServiceFee}} -->
									 </view>
									 </template>
		 						<template v-slot:footer >
									<uni-icons class="slot-image"  type="closeempty" @click="deleteServiceFee(item.id)"></uni-icons>

									<!-- <image class="slot-image"  mode="widthFix" src="../../static/close.png" @click="deleteServiceFee(item.id)"></image> -->
		 							</template>
		 				  </uni-list-item>
		 </uni-list>
		 </view>
		  <view class="end">

			  <!-- <view> -->
		  			<view class="end-left">
		  				<checkbox-group @change="selectAllGoods">
						<!-- <checkbox-group @change="allChoose"> -->
		  					<label>
		  						<checkbox  :checked="allchecked?true :false" color="#2784FF"/>全选
		  					</label>
		  				</checkbox-group>
		  				<view>
								总计：<text style="color: #FE6104;font-size: 14px;">￥ {{totalServiceFee}}</text>
		  				</view>
		  				</view>
						<view class="dialog-box">
										<!-- <text class="dialog-text">输入内容：{{ value }}</text> -->
									</view>
		  				<view class="end-right" @click="openInput">
		  				    结算({{totalNum}})
		  				</view>
						<!-- </view> -->
				
		  		</view>
				
				<view>
				<uni-popup ref="input" type="dialog">
						<!-- <uni-popup-dialog   mode="input" title="请输入报价单信息"  @confirm="formSubmit($event)"> -->
									<view style="background-color: white;width: 230px;height: 235px;">
									<view style="width: 144px;margin: 0 auto; padding-top: 17px;"><text style="font-size: 18px; font-weight: 540; text-align: center;">请输入报价单信息</text></view>
									<form @submit="formSubmit($event)">
									<input  class="uni-input"  name='projectName' placeholder="项目名称"></input>
									<input  class="uni-input"   name='customerName' placeholder="用户名称"></input>
									<view style="display: flex;margin-top: 25px;">
									<button class="closeButton" @click="closeInput">取消</button>
									<button class="confirmButton" form-type="submit">确认</button>
									</view>
									</form>
									</view>
									<!-- </uni-popup-dialog> -->
				</uni-popup>
				</view>
				
		  <!--购物车弹窗  -->
		  
		 <!-- 购物车没商品出现的页面 -->
		 		<!-- <view class="empty" v-if="show==false"> -->
						<view class="empty" v-if="goods.length ==0">
					<!-- <view> -->
		 			<!-- <image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F82%2F40%2F596fa6dc00bb4_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633499781&t=d37222e32213957ddbdd01d62e071309" mode="widthFix" style="width: 400rpx;"></image> -->
		 		<view class="empty-text">暂无项目</view>
		 		<!-- <view class="empty-button" @click="goshopping">去选购</view> -->
		 		</view>
		 		<!-- 购物车加购商品的东西 -->
		 		<view v-if="goods.length !==0" >
					<view>
					<uni-swipe-action >
					<uni-swipe-action-item class="swipe-action-item" :right-options="options" v-for="(item,index) in goods" :key="index" @click="bindClick(item.id)" @change="swipeChange($event, index)" >
		 		<!-- 通过循环商品呈现出每个商品 -->
		 			<view class="goods-detail" >
						
		 				<view class="detail-left">
		 					<view class="goods-left">
		 					<!-- 商品的选择框 -->
		 						<checkbox-group @change="select(item)">
		 							<label>
		 								<checkbox  class="selected" color="#555555" :checked="item.flag?true :false"/>
		 							</label>
		 						</checkbox-group>
		 					</view>
		 					<view class="size">
								<text style='font-size: 14px;padding-bottom: 5px;'>{{item.productName}}</text>
								<text style="font-size: 12px;padding-bottom: 10px;">{{item.productSpecification ||''}}</text>
		 					    <text class="goods-price">￥{{item.productPrice}}/件</text>
		 					</view>
		 				</view>
		 				<view class="detail-right">
		 					<text class="subtract" @click="reduce(item)">-</text>
		 					<text class="num" >{{item.productCount}}</text>
		 					<text @click="add(item)" class="add">+</text>
		 				</view>
						
		 			</view>
                       </uni-swipe-action-item>
						</uni-swipe-action>
						<view :style="{'height': 25*(serviceFeeChecked.length)+'px', 'bottom':0,'width':'100%'}"></view>
						<view class="endReplace"></view>
		 		</view>
				</view>
					<uni-popup ref="message" type="message">
						<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
					</uni-popup>
            <!-- <uni-load-more :status="status" :content-text="contentText" /> -->
	</view>

</template>

<script>
	export default {
		onShow() {
			const self = this 
			const num = uni.getStorageSync('shoppingNumber')
			console.log(num)
			uni.setTabBarBadge({
				index:1,
				text:num.toString()
			})
			uni.request({
				method:'GET',
				url:this.$api+'/api/productChecklist/list',
				header: {
				'Authorization':"Bearer " + uni.getStorageSync('token'),
				},
				success(res) {
					console.log(res)
					self.allchecked = false
					res.data.data.map(item=>{
						item.flag = false
					})
					self.goods = res.data.data
				}
			})
			uni.request({
				method:'POST',
				url:this.$api+`/api/serviceCharge/listByUserChecked?productPrice=1`,
				header: {
				'Authorization':"Bearer " + uni.getStorageSync('token'),
				},
				success(res) {
					console.log(res)
					self.serviceFeeChecked = res.data.data
				}
			})
			// uni.setTabBarBadge({
			// 	index:1,
			// 	text:self.goods.length
			// })
		},
		// onReachBottom() {
		// 			let that = this
		// 			if (that.total <= that.list.length) {
		// 				uni.showToast({
		// 					title: '已加载全部数据',
		// 					icon: "none"
		// 				});
		// 			} else {
		// 				that.submitDate.page++;
		// 				that.getData()
		// 			}
		// 		},
				onPullDownRefresh() {
							const self = this
								uni.request({
									method:'GET',
									url:this.$api+'/api/productChecklist/list',
									header:{
										'Authorization':"Bearer " + uni.getStorageSync('token'),
									},success(res) {
										console.log(res)
										self.goods = res.data.data
									}
								})
						},
				

		data() {
			return {
				status: 'more',
				type: 'center',
				contentText:"生成中！！！",
				msgType:'success',
				messageText:'成功',
				 selectBox: false,
				    chooseItem: '筛选',
				    tabs: [],
				    tabCur: 0, //默认选中
				    cartList: [], // 购物车
					//购物车有无商品
					show:true,
					//全选是否选中					
					allchecked:false,
					checked:false,
					checkedArr: [], 
					//商品
					goods:[],
					options: [ {
							text: '删除',
							style: {
								backgroundColor: '#ff5500',
								color: '#fff',
							
							}
						}],
					serviceFeeChecked:[],

			}},
			onReady() {
				
			},
			methods:{
				        messageToggle(type,messageText) {
				        				this.msgType = type
				        				this.messageText = messageText
				        				this.$refs.message.open()
				        			},
                        openInput(){
                        	this.$refs.input.open()
                        			},
						closeInput(){
							this.$refs.input.close()
						},
						dialogToggle() {
								this.$refs.inputDialog.open()
							},
						dialogClose() {
								console.log('点击关闭')
							},
						formSubmit(e) {
								const self= this
								console.log(e)
								const chooseGoods = []
								this.goods.map((item)=>{
									if(item.flag === true){
										chooseGoods.push(item.id)
									}
								})
								uni.showLoading({
									title: '生成中'
								})
								console.log(chooseGoods)
								uni.request({
									url:this.$api+`/api/productChecklist/generatePdf`,
									method:'POST',
									data:{
										customerName:e.target.value.customerName,
										ids:chooseGoods,
										projectName:e.target.value.projectName
									},
									header: {
									'Authorization':"Bearer " + uni.getStorageSync('token'),
									},
									success(res) {
										console.log(res)
										if(res.data.code === 200){
											uni.hideLoading()
											self.$refs.input.close()
											uni.navigateTo({
												url:'/pages/history/history'
											})
											uni.request({
												url:self.$api+`/api/productChecklist/removeBatch`,
												method:"POST",
												data:chooseGoods,
											    header:{
												    'Authorization':"Bearer " + uni.getStorageSync('token'),
											    },
												success(res) {
												   console.log('5555555',res)
												 uni.request({
												 	method:'GET',
												 	url:self.$api+'/api/productChecklist/list',
												 	header: {
												 	'Authorization':"Bearer " + uni.getStorageSync('token'),
												 	},
												 	success(res) {
												 		console.log(res)
												 		self.allchecked = false
												 	    res.data.data.map(item=>{
												 		item.flag = false
												 	})
												 		self.goods = res.data.data //2449.11
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
												   }
												   
												})
										}else{
											uni.hideLoading()
											self.messageToggle('error','失败')
											self.$refs.input.close()
										}
										
									}
								})
								},
					goshopping(){
						uni.navigateTo({
						url:'/pages/list/list'
					})
				},
					change(e){
				       console.log(e)
				},
				// 单选
					select(item){
						const self = this
						item.flag=!item.flag	
						if(!item.flag){
						  this.allchecked=false
						}else{
						 const cartList=this.goods.every((item)=>{
						  return item.flag==true
							})
						if(cartList){
							this.allchecked=true
							}else{
							this.allchecked=false
						}
					}
					},
					// 全选，全不选
					 selectAllGoods(){
						 
						this.allchecked=!this.allchecked
						const self = this
							this.goods.map(item=>{
								item.flag = self.allchecked
							})
				    },
                deleteServiceFee(id){
					const self = this
					console.log(id)
					uni.request({
						url:this.$api+`/api/serviceCharge/removeTo/${id}`,
						method:'POST',
						header:{
						    'Authorization':"Bearer " + uni.getStorageSync('token'),
						},
						success(res) {
							console.log(res)
							uni.request({
								method:'POST',
								url:self.$api+`/api/serviceCharge/listByUserChecked?productPrice=1`,
								header: {
								'Authorization':"Bearer " + uni.getStorageSync('token'),
								},
								success(res) {
									console.log(res)
									self.serviceFeeChecked = res.data.data
								}
							})
						}
					})
				},
					reduce(item){
						const self = this
						console.log(item)
						console.log(item.productId)
						const id = item.productId
						let num=item.productCount
							uni.request({
								url:self.$api+`/api/productChecklist/removeOne/${id}`,
								method:"POST",
							    header:{
								    'Authorization':"Bearer " + uni.getStorageSync('token'),
							    },success(res) {
								   console.log(res)
								   
								   item.productCount -=1
								let num = 0
								self.goods.map(item => {
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
								   if(item.productCount == 0){
									  uni.request({
									  	url:self.$api+`/api/productChecklist/removeBatch`,
									  	method:"POST",
									  	data:[item.id],
									      header:{
									  	    'Authorization':"Bearer " + uni.getStorageSync('token'),
									      },
									  	success(res) {
									  	   console.log('6666',res)
									  	   self.allchecked = false
										   uni.request({
										   	method:'GET',
										   	url:self.$api+'/api/productChecklist/list',
										   	header: {
										   	'Authorization':"Bearer " + uni.getStorageSync('token'),
										   	},
										   	success(res) {
										   		console.log(res)
										   	self.allchecked = false
										   	res.data.data.map(item=>{
										   		item.flag = false
										   	})
										   	self.goods = res.data.data
										   	}
										   })
									  	   }
									  	})
								   }
							}
							})
					},
					add(item){
						const self = this
						console.log(item.productId)
						const id = item.productId
						uni.request({
							url:self.$api+`/api/productChecklist/addOne/${id}`,
							method:"POST",
						    header:{
							    'Authorization':"Bearer " + uni.getStorageSync('token'),
						    },success(res) {
							   console.log(res)
							   item.productCount +=1
							   let num = 0
							   self.goods.map(item => {
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
					  },
					toggle(type) {
						// let self = this
						// this.pickerShow = true  
						// setTimeout(function(){
						// 	self.$refs.popup.open('center')
						// },50)
						this.type = type
						// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
						this.$refs.popup.open(type)
					},
					// dialogInputConfirm(val) {
					// 	uni.showLoading({
					// 		title: '生成中'
					// 	})
					// 	setTimeout(() => {
					// 			uni.hideLoading()
					// 			console.log(val)
					// 			this.value = val
					// 			// 关闭窗口后，恢复默认内容
					// 			this.$refs.inputDialog.close()
					// 		}, 1000)
						
					// },
					// inputDialogToggle() {
					// 	this.$refs.inputDialog.open()
					// },
					deleteProduct() {
					  console.log('删除')
					},
					bindClick(id) {
						const self = this
						// const id = item.productId
						    console.log([id])
							uni.request({
								url:self.$api+`/api/productChecklist/removeBatch`,
								method:"POST",
								data:[id],
							    header:{
								    'Authorization':"Bearer " + uni.getStorageSync('token'),
							    },
								success(res) {
								   console.log(res)
							    
								   // self.goods = res.data.data
								   uni.request({
								   	method:'GET',
								   	url:self.$api+'/api/productChecklist/list',
								   	header: {
								   	'Authorization':"Bearer " + uni.getStorageSync('token'),
								   	},
								   	success(res) {
								   		console.log(res)
										self.allchecked = false
										res.data.data.map(item=>{
											item.flag = false
										})
								   		self.goods = res.data.data 
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
							}
							})
						},
					swipeChange(e, index) {
							console.log('当前状态：' + e + '，下标：' + index)
						},
					bindChange(value) {
							console.log('返回数值：', value);
						},

				},
				computed:{
					totalNum(){
						let totalNum = 0;
						this.goods.map(item => {
							item.flag ? totalNum += item.productCount : totalNum += 0
						})
						uni.setNavigationBarTitle({
							title:`已勾选项目(${totalNum})`
						})
						return totalNum
					},
					// totalShopping(){
					// 	let totalShopping = 0;
					// 	this.goods.map(item=>{
					// 		totalShopping +=1
					// 	})
					// 	uni.setTabBarBadge({
					// 		index:1,
					// 		text:uni.getStorage('shoppingNumber').toString()
					// 	})
					// 	// console.log(totalShopping)
					// 	return totalShopping
					// },
					totalPrice() {
						 let totalPrice = 0;
						this.goods.map(item => {
							// totalPrice += item.totalProductPrice
							item.flag ? totalPrice += (item.productCount*parseFloat(item.productPrice)) : totalPrice += 0
							// item.flag ? totalPrice += 0 : totalPrice += item.totalProductPrice 
						})
						return totalPrice
					},
					totalServiceFee(){
						let totalServiceFee = 0;
						let totalPrice = 0;
						let serviceFee = 0;
						let totalRadio = 0;
						this.goods.map(item => {
							item.flag ? totalPrice += (item.productCount*parseFloat(item.productPrice)) : totalPrice += 0
						})
						this.serviceFeeChecked.map(item=>{
							totalRadio +=item.expenseRatio
						})
				        serviceFee = totalPrice.toFixed(2)*totalRadio/100
						totalServiceFee = (totalPrice+serviceFee)
						return totalServiceFee.toFixed(2)
					}
				}
			
		}
	
</script>

<style lang="scss">
	//弹出框
	.confirmButton{
		width:80px;
		height:30px;
		background-color: $uni-bg-color;
		color:#FFFFFF;
		line-height: 30px;
		font-size: 14px;
		margin-top:15px;
	}
	.closeButton{
		width:80px;
		height:30px;
		// background-color: $uni-bg-color;
		// color:#FFFFFF;
		line-height: 30px;
		font-size: 14px;
		margin-top:15px;
	}
	.uni-input{
		    width: 200px;
		    height: 30px;
		    margin: 0 auto;
		    border-bottom: 1px solid #BBBBBB;
		    margin-top: 15px;
	}
	.checkBox_shade{
		position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 10;

	}
/*底部区域  */

.bottom_box {
  width: 100%;
  height: 80rpx;
  position: fixed;
  left: 0;
  bottom: 0px;
  z-index: 100;
  background-color: #F0FFF0;
}


.all_money {
  position: absolute;
  width: 50%;
  height: 80rpx;
  top: 0;
  left: 25%;
  line-height: 80rpx;
  text-align: center;
  font-size: 14px;
}

.choose_ok {
  position: absolute;
  width: 25%;
  height: 80rpx;
  top: 0;
  right: 0;
  line-height: 80rpx;
  text-align: center;
  color: #fff;
  font-size: 40rpx;
  background-color: #FE6104;
}

.fontP {
  color: var(--themeColor);
  font-size: 40rpx;
}
.serviceFee{
	position: fixed;
	bottom: 46px;
    font-size: 13px;
	z-index: 99;
	width: 100%;
}
	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		// margin: 0 auto !important;
		margin-right: 10px;
		margin-left: auto;
		width: 20px;
		height:20px;
	}
	.uni-list-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		font-size: 12px !important;
		position: relative;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		flex-direction: row;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
	.uni-list-item__container {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: 4px 30px !important;
		// padding: $list-item-pd;
		// padding-left: $un-spacing-row-lg;
		flex: 1;
		overflow: hidden;
		// align-items: center;
	}
.goods{
		line-height: 80rpx;
		background-color: #FFFFFF;
		&-detail{
			width: 90%;
			// height: 100px;
		    display: flex;
		    padding: 30rpx 15rpx 30rpx 30rpx;
		    background-color: #fff;
		    justify-content: space-between;
		    border-bottom: 5rpx solid #F1F1F1;
		    align-items: center;
		    margin: 15px auto;
			box-shadow: 0px 1px 4px 0px #000000;
		    .detail-left{
		        display: flex;
		        .goods-left{
		            display: flex;
		            align-items: center;
		        }
		    }
		    .size{
		        display: flex;
		        justify-content: space-around;
		        flex-direction: column;
		        margin-left: 20rpx;
				width: 195px;
		        .goods-price{
		            font-size: 25rpx;
		            color: #F44545;
		            
		        }
		    }
		    .detail-right{
		        text{
		            width: 47rpx;
		            line-height: 47rpx;
		            text-align: center;
		            display: inline-block;
		            background-color: #F7F7F7;
		            margin-right: 10rpx;
		        }
		        .add {
		            color: #FA4305;
		            border-radius: 10rpx 30rpx 30rpx 10rpx;
		            margin-right: 20rpx;
		        }
		        .subtract{
		            border-radius: 30rpx 10rpx 10rpx 30rpx;
		        }
		    }
		}
	}
	.empty{
		
		    position: relative;
		    top: 220rpx;
		    text-align: center;
		    display: flex;
		    align-items: center;
		    flex-direction: column;
		    &-text{
		        color: #808080;
		        margin-bottom: 50rpx;
		    }
		    &-button{
		        width: 300rpx;
		        height: 90rpx;
		        color:orange;
		        border: 1rpx solid orange;
		        text-align: center;
		        line-height: 90rpx;
		        border-radius: 48rpx;
		    }		
	}
	.endReplace{
		width: 100%;
		height: 90rpx;

		// position: fixed;
		bottom: 0px;
		left: 0;
	}
	.end{
	    width: 100%;
	    height: 90rpx;
	    background-color:#fff;
	    position: fixed;
	    bottom: 0px;
	    left: 0;
	    display: flex;
	    align-items: center;
		z-index: 99;
	    &-left{
	        width: 70%;
	        display: flex;
	        justify-content: space-between;
	        padding: 0 30rpx;
	        .end-flex{
	            display: flex;
	            align-items: center;
	        }
	    }
	    &-right{
	        width: 30%;
	        line-height: 90rpx;
	        background-color: #FE6104;
	        text-align: center;
	        color: #fff;
	    }
	}


</style>
