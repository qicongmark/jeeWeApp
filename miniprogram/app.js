//app.js
let util = require("./utils/util.js");
const cloud = wx.cloud
App({

  tt:"123",//云开发中手动更新的时间戳
  SERVER: "https://jeeweixin.com/json/qdc202288/",
  
  //大厂作息搜索使用
  SEARCH_COUNT: "_search_count",

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: cloud.DYNAMIC_CURRENT_ENV,
        traceUser: true,
      })
    }
    
    this.globalData = {
      globalUserInfo: {}
    }

    wx.getStorage({
      key:this.SEARCH_COUNT,
      success:res=>{
        //console.log(res)
      },
      fail:res=>{
        wx.setStorage({
          key:this.SEARCH_COUNT,
          data:1
        })
      }
    })
  },
  
  getUri(url, timestamp){
    this.tt = util.getCurDay()
    if(url.indexOf(this.SERVER) == -1){
      url=this.SERVER+url+"?t="+this.tt
    }
    //console.log(url);
    return url
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

  getQuestionTypes(){
    return [{
        id: 1,
        name: "Java",
        image: "java.png"
    }, {
        id: 2,
        name: "JavaEE",
        image: "javaee.png"
    }, {
        id: 3,
        name: "SSM",
        image: "ssm.png"
    }, {
        id: 4,
        name: "MySQL",
        image: "mysql.png"
    }, {
        id: 5,
        name: "中间件",
        image: "midware.png"
    }, {
        id: 6,
        name: "微服务",
        image: "cloud.png"
    }, {
        id: 7,
        name: "大厂面试",
        image: "bat.png"
    }, {
        id: 8,
        name: "机试",
        image: "algorithm.png"
    }, {
        id: 9,
        name: "前端",
        image: "html.png"
    }]
  }

})

