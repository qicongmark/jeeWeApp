
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database()
const _ = db.command

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  
  let id = "a0041d0f63417b32007ec1193ecc91b5"
  let doc = db.collection("site").doc(id)
  
  return await doc.get({
    success:res=>{
      return res.data
    }
  })
  
};

