// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})

// 添加数据
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    token:true
  }

  /**
  let admins = ["o9BQY0evkNNJILeuTLKLhJ0Hy2sw",
                "o9BQY0eiAyq98MKDA-hL_TiIxi4E"]

  if(admins.indexOf(wxContext.OPENID) == -1){
    return {
      openid: wxContext.OPENID,
      token:false
    }
  }else{
    return {
      openid: wxContext.OPENID,
      token:true,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID
    }
  } */
  
}

