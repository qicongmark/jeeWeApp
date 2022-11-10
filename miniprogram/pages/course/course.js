// pages/learn/learn.js

let Server = require("../../utils/Server.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    componey:[
      "L0.png",
      "L1.png",
      "L2.png",
      "L3.png"
    ],
    url:"https://mp.weixin.qq.com/s/NTVJQYZ2ZXdjH7uQCkrJww"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })

    this.loadCourses()
  },

  //加载课程
  loadCourses: function () {
    let that = this
    Server.requestJson("courses.json",function(res){
      res.data
      for(let i in res.data){
        if(res.data[i].icon){
          res.data[i].icon = app.getUri(res.data[i].icon)
        }
      }
      that.setData({
        courses: res.data,
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})