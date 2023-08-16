module.exports = {
  getCornerMarker() {
  //获取token用来判断是否已经登录
    let token = wx.getStorageSync('token')

	//如果没有登录要走的逻辑
    if (!token) {
    
    //wx.setTabBarBadge方法用来给底部导航栏设置角标
    //index: 3, //标志添加位置,从左数第几个需要添加，从0数
    // text: "0"//角标的内容
    
      wx.setTabBarBadge({ 
        index: 3, 
        text: "0" 
      })
      
      return

	//如果登录了要走的逻辑
    } else {
	
		//调用封装好的方法，获取到购物车数据
		uni.request({
			method:'GET',
			url:this.$api+'/api/productChecklist/list',
			header: {
			'Authorization':"Bearer " + uni.getStorageSync('token'),
			},
			success(res) {
				console.log(res)
				// self.allchecked = false
				res.data.data.map(item=>{
					item.flag = false
				})
				// self.goods = res.data.data
				
			}
		})
      getShoppingCartGoodsList({}).then(res => {
      //获取总共有多少件商品
        let num = res.data.goods_groups[0].total_amount
        //将获取到的数据赋值给---text
        wx.setTabBarBadge({ 
          index: 3, 
          text: num 
        })
      })
    }

  },
}
