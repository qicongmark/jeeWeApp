// app.js
const envList = require("./envList.js").envList

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: envList[0].envId, 
        traceUser: true,
      });
    }
    this.globalData = {};
  },

  getSubCategory(){
    return [
      {name:"Java",id:1},
      {name:"软件",id:2},
      {name:"路线图",id:3},
      {name:"PDF",id:4},
      {name:"其他",id:99}
    ]
  },
  
});

