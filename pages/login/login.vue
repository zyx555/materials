<template>
	<view class="container">
		
		<view class="register">登录</view>
		<view class="registerBox">
			<form @submit="formSubmit($event)">
				<input name="jobNumber" placeholder="账号" class='accountNumber'></input>
				<input name="password" password  placeholder="密码" class='password'></input>
				<!-- <input name="password" :password="showPassword"  placeholder="密码" class='password'></input> -->
				<!-- <view  :class="[!showPassword ? 'psd-eye-active' : 'psd-eye']" @click="changePassword"></view> -->
				<button form-type="submit" class='registerButton'>登录</button>
				<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
				</uni-popup>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				    jobNumber:'',
					password:'',
					type: 'center',
					msgType: 'error',
					messageText: '',
					value: '',
					showPassword:true
			}
		},
		methods: {
			 changePassword: function() {
			            this.showPassword = !this.showPassword;
			        },
           formSubmit(e){
			 this.jobNumber = e.target.value.jobNumber,
			 this.password = e.target.value.password
		  const self = this
		  uni.request({
		  method:"post",
		  url: this.$api+'/api/user/wechatUserLogin',
		  data:{
			  jobNumber:this.jobNumber,
			  password:this.password
		  },
		  header: {
		  'content-type': 'application/json' 
		  },
		  success: (res) => {
			  
		  // 请求成功之后
		  if(res.data.code===200)
	        {
		    console.log(res)
		    uni.setStorage({
		        key:'token',
		        data:res.data.data,
		        success() { 
		        uni.switchTab({  url: '/pages/list/list'});
		      }
		       });
			   uni.setStorage({
				   key:'username',
				   data:self.jobNumber,
			   })
			   uni.setStorage({
			   	key:'oldPassword',
				data:self.password
			   })
		   }
		   else {
			    const val = res.data.msg 
				self.messageText = res.data.msg 
				self.$refs.message.open()		
		   }
		   }
		})
		},
	},
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	    margin-top:57px;
	}
	.register{
		font-weight: 500;
		font-size: 28px;
		text-align: center;
	}
	.registerBox{
		display: flex;
		justify-content: center;
		padding: 15px;
	}
	.accountNumber,.password{
		width: 255px;
		height:36px;
		position: relative;
		font-size: 14px;
		color:#888888;
		padding: 4px;
		margin-top: 21px;
		background-color: white;
		border-radius: 13px;
	}
	.checkText{
	   font-size: 10px;
	   padding: 10px;
	}
	.checkBox{
		transform:scale(0.6);
		// color:$uni-bg-color;
	}
	.registerButton{
		height:44px;
		background-color: $uni-bg-color;
		color:#FFFFFF;
		line-height: 44px;
		font-size: 15px;
		margin-top:21px;
		border-radius: 13px;
	}
	.forgetPassword{
		font-size: 12px;
		color:$uni-bg-color;
		display: flex;
		justify-content: flex-end;
		padding: 10px;
	}
	.psd-eye-active{
	        width: 45rpx;
	        height: 45rpx;
	        background:url(../../static/icon_turn.png) no-repeat center center;
	        position: absolute;
	        right: 143rpx;
	        top: 28%;
	        z-index:10;
	    }
	.psd-eye{
	        width: 45rpx;
	        height: 45rpx;
            background:url(../../static/eye.png) no-repeat center center;
	        position: absolute;
	        right: 143rpx;
	        top: 28%;
	        z-index: 10;
	    }
	
</style>
