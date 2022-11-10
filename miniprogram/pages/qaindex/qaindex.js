const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:1,
    qArticles:[],
    category:app.getQuestionTypes()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    })

    //获取站点访问次数
    wx.cloud.callFunction({
      name: "quickFunctions",
      data: {
        type: "getSite"
      },
      success:res=>{
        this.setData({
          site:res.result.data
        })
      }
    })
  },

  //模拟面试
  exam: function(e){
    wx.navigateTo({
      url: '/pages/exam/exam',
    })
  },

  //帮助（加群交流）
  help: function(e){
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },

  changeTab: function(e) {
    this.setData({
      tab : e.target.id
    })
    //题库下载
    if(e.target.id == 2){
      if(this.data.qArticles.length == 0){
        this.loadQArticle()
      }
    }
  },

  //加载题库
  loadQArticle: function () {
    //加载云数据库中的数据
    wx.showLoading({
      title: '数据加载中',
    })

    db.collection("article").where({
      category: 4
    }).field({
      title: true
    }).orderBy("status", "desc").orderBy("time", "desc").get({
      success: res => {
        this.setData({
          qArticles: res.data
        })
      },
      complete: res => {
        wx.hideLoading()
      },
      fail: res => {
        wx.showToast({
          title: '获取失败',
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
  
})