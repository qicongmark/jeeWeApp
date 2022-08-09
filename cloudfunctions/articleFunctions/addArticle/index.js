
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database()

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  let article = event.article
  article._openid = wxContext.OPENID

  return await db.collection("article").add({
    data:article,
    success:res=>{
      return {
        _id: article._id
      }
    }
  })

  /**
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }; */
  
};
