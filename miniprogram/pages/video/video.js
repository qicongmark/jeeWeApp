// pages/course/course.js
let Server = require("../../utils/Server.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })

    let code = options.code
    let name = options.name
    this.setData({
      code:code,
      name:name
    })
    this.loadCourseChapter(code + ".json")
  },

  //加载课程
  loadCourseChapter: function (file) {
    let that = this
    Server.requestJson(file,function(res){
      that.setData({
        finderUserName: res.data.finderUserName,
        courseChapter: res.data.chapter
      })
    })
  },

  previewImg: function (e) {
    let img = e.currentTarget.dataset.img
    let url = app.getUri(img)
    let imgList = [url]
    wx.previewImage({
      current: url,
      urls: imgList
    })
  },

  //打开视频
  openVideo: function(e){
    let fid = e.currentTarget.dataset.fid
    console.log(this.data.finderUserName)
    wx.openChannelsActivity({
      finderUserName: this.data.finderUserName,
      feedId: fid
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const promise = new Promise(resolve => {
      resolve({
        title: this.data.name,
        path: '/pages/video/video?code='+this.data.code+"&name="+this.data.name
      })
    })
    return {
      promise
    }
  }
})