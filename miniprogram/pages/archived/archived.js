const app = getApp()
const db = wx.cloud.database()

Page({

  //分页
  pageNum:1,
  pageSize:20,
  hasMore:true,

  data: {
    articles:[]
  },

  onLoad: function (e) {

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    this.loadArticle()
  },

  loadArticle: function () {
    //加载云数据库中的数据
    wx.showLoading({
      title: '数据加载中',
    })

    let query = db.collection("article").where({
      category: 3
    }).field({
      title: true,
      link: true,
      time: true
    }).orderBy("status", "desc").orderBy("time", "desc")
    
    query = query.skip((this.pageNum-1)*this.pageSize).limit(this.pageSize)
    query.get({
      success: res => {
        this.hasMore=(res.data.length==this.pageSize)?true:false
        this.pageNum=this.pageNum + 1

        let articles = this.data.articles
        articles = articles.concat(res.data)
        this.setData({
          articles: articles
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.hasMore){
      this.loadArticle()
    }
  },

});