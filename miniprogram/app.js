// app.js
const envList = require("./envList.js").envList

App({
  
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: envList[0].envId, //wx.cloud.DYNAMIC_CURRENT_ENV,
        traceUser: true,
      });
    }
    this.globalData = {};
  }
});