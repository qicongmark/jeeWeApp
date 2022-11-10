
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database()
const _ = db.command

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("article").doc(event.id).update({
    data: {
        read: _.inc(1)
    }
  })
};
