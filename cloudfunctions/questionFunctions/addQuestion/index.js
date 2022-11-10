
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database()

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  let question = event.question
  question._openid = wxContext.OPENID

  return await db.collection("question").add({
    data:question,
    success:res=>{
      return {
        _id: question._id
      }
    }
  })
};
