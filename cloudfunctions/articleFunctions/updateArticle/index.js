
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database()

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  
  // 获取基础信息
  let article = event.article

  return await db.collection("article").doc(article.id).update({
    data:article,
    success:res=>{
      return {
        _id: article._id
      }
    }
  })
  
};
