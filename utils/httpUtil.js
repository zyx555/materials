import {httpReq} from './httpReq.js'

class HttpUtil{
	register = (params) => httpReq("post", "/user/wechatUserLsogin", params);
	searchCommodity = (params)=>httpReq("get",'/productBasic/listByClassificationIdAndStatus')
	deleteOne = (params) =>httpReq("post",'/productChecklist/removeBatch',params)
}

export default new HttpUtil();