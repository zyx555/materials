<template>
	<view>
		<!-- <web-view :src="src"></web-view> -->
	</view>
</template>

<script>
	export default {
		onLoad(option) {
			console.log('iosss',option)
		    this.src =this.$api+ option.contractUrl
			let fileName = option.fileName
			let filePath =`${wx.env.USER_DATA_PATH}/${fileName}`
			uni.downloadFile({
			  url: this.src,
			  filePath:filePath,
			  success: function (res) {
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
		data() {
			return {
				src: '',
			};
		
		}
	}
</script>

<style lang="scss">

</style>
