<template>
	<view>
		<view class="container">
			<form @submit="formSubmit($event)">
			<view class='item'>
			<text style='padding-top: 8px;'>旧密码：</text>
			<input name="oldPassword"  class='password' ></input>
			</view>
				<view class='item'>
			<text style='padding-top: 8px;'>新密码：</text>	
			<input name="newPassword" class='password'></input>
			</view>
			<view class='item'>
			<text style='padding-top: 8px;'>确认密码：</text>	
			<input name="confirmPassword" class='password'></input>		
			</view>			
				<button form-type="submit" class='updateButton'>确认修改</button>
			</form>
			<uni-popup ref="message" type="message">
			<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	// import http from '../../request.js'
	export default {
		data() {
			return {
				oldPassword:uni.getStorage({
					key:'oldPassword',
					success: res => {
						console.log(res.data,'获取缓存成功')
						this.oldPassword = res.data
					}
				}),
			    password:'',
				newPassword:'',
				confirmPassword:'',
				type: 'center',
				msgType: 'success',
				messageText: '',
			};
		},
		methods:{
			formSubmit(e){
				console.log(e)
				const self = this
			
				console.log(self.oldPassword,'缓存里面的密码')
				this.password = e.target.value.oldPassword
				this.newPassword = e.target.value.newPassword
				this.confirmPassword = e.target.value.confirmPassword
				if(this.password !== this.oldPassword){
					self.messageText='旧密码错误'
					self.msgType='error'
					self.$refs.message.open()	
				}else if(this.newPassword !== this.confirmPassword ){
					self.messageText='两次输入密码不一致'
					self.msgType='error'
					self.$refs.message.open()	
				}else if(this.password == this.oldPassword && this.newPassword == this.confirmPassword ){
					uni.request({
						url:this.$api+'/api/user/wechatUserUpdatePassword',
						method:'POST',
						data:{
							newPassword:self.newPassword,
							oldPassword:self.oldPassword
						},
		                header: {
		                   // 'content-type': 'application/json' ,
						   'Authorization':"Bearer " + uni.getStorageSync('token')
		                },
						success(res) {
							console.log(res)
							if(res.data.code === 200){
							self.messageText='修改成功'
							self.$refs.message.open()
							uni.clearStorage()
							uni.navigateTo({
							  url:'/pages/login/login'	
							})
							}
							
								// uni.setStorage({
								// 	key:'oldPassword',
								// 	data: self.newPassword,
								// 	success() {
								// 		uni.switchTab({url: '/pages/me/me'})
								// 		}
								// })
							// }
						}
					
					})
				}else{
					self.messageText='失败'
					self.msgType='error'
					self.$refs.message.open()
				}
			}
		}
	}
</script>

<style lang="scss">
.item{
		display: flex;
		justify-content: center;
}
.password{
		// width: 100%;
		width:233px;
		height:30px;
		font-size: 14px;
		border-bottom:1px solid #BBBBBB;
		color:#888888;
		padding: 4px;
	}
	.updateButton{
		width:80px;
		height:30px;
		background-color: $uni-bg-color;
		color:#FFFFFF;
		line-height: 30px;
		font-size: 14px;
		margin-top:45px;
		padding: 0px;
	}
</style>
