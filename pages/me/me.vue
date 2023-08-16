<template>
	<view>
		<view class="container">
			<view class="font">
				
				<view class="head">
					<image src='../../static/stLine-user-l.png' style='width:42px;height: 42px;'></image>
			</view>
			<View class='userInformation'>
								   <view>姓名：{{username}}</view>
								   <!-- <view>账户：13190281181</view> -->
			</view>
			<view>
				<button type='default' @click="dialogToggle">退出登录</button>
			</view>
			</view>
			<view class='bottom'>
				
			<view class='block' >
			<navigator url="/pages/accountSafe/accountSafe" hover-class="navigator-hover">
			<image src="../../static/accountSafe.png" class='accountSafe'></image>
			<text class='accountSafeText'>账户安全</text>
			</navigator>
			</view>
			
			<view class='block'>
			<navigator url="/pages/history/history" hover-class="navigator-hover">
			<image src='../../static/history.png' class='history'></image>
			<text class='historyText'>历史报价单</text>
			</navigator>
			</view>
			
			</view>
		
		</view>
		<view>
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="确定" title="退出" content="确认退出登录吗？" @confirm="dialogConfirm"
					@close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'center',
				msgType: 'success',
				messageText: '退出成功',
				username:	uni.getStorage({
							key: 'username',
							success:  res=>{
								console.log(res)
								this.username = res.data
							}
						}),
		
			};
		},
		methods: {
			dialogToggle() {
				this.msgType = 'warn'
				this.$refs.alertDialog.open()
					
				},
				dialogClose() {
					console.log('点击关闭')
				},
				dialogConfirm() {
					uni.clearStorage()
					uni.navigateTo({
						url:'/pages/login/login'
					})
				},
				
			logout(){
				this.$refs.alertDialog.open()
				uni.clearStorage()
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}
		},
	}
</script>

<style lang="scss">
.head{
	width: 81px;
	height:79px;
	border-radius: 50%;
	background-color:white ;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 16px;
}
.font{
	width: 100%;
	height:125px;
	background-color: $uni-bg-color;
	display: flex;
	align-items: center;
}
.userInformation{
	width:140px;
	height:45px;
	font-size: 16px;
	margin-left:10px;
	color: #F8F8F9;
}
.bottom{
	// margin: 80px;
	display: flex;
	justify-content: space-evenly;
	margin-top: 15px;
}
.block{
	width: 100px;
}
.accountSafe,.history{
	width:66px;
	height:66px;
	padding:10px
}
.accountSafeText,.historyText{
	padding:10px
}
</style>
