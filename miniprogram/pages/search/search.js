// pages/search/search.js
const db = wx.cloud.database()
const _ = db.command
const util = require("../../utils/util.js");

Page({

  //分页
  pageNum:1,
  pageSize:20,
  hasMore:true,

  /**
   * 页面的初始数据
   */
  data: {
    articles:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    })

    let key = options.key
    if (key) {
      this.setData({
        key: key
      })
      this.loadArticleByKey(key)
    }
  },

  doSearch:function(e){
    let key = e.detail.value.key
    if(util.isEmpty(key)){
      wx.showToast({
        title: '请输入关键字',
      })
    }else{
      this.setData({
        key:key,
        articles:[]
      })
      
      this.pageNum = 1
      this.hasMore = true
      this.loadArticleByKey(key)
    }
  },

  loadArticleByKey: function (key) {
    if (key) {
      //加载云数据库中的数据
      wx.showLoading({
          title: '数据加载中',
      })
      
      let query = db.collection("article").where(_.or([
        {title: db.RegExp({
          regexp: key,
          options: 'i'
        })},
        {desc: db.RegExp({
          regexp: key,
          options: 'i'
        })}
      ])).field({
          title: true,
          desc: true,
          link: true
      })
      query = query.skip((this.pageNum-1)*this.pageSize).limit(this.pageSize)
      query.get({
        success: res => {
            let regExp = new RegExp(key,"gi")
            let str = "<font class='red'>"+key+"</font>"
            for(let item of res.data){
                item.title = item.title.replace(regExp, str)
                if(item.desc){
                  item.desc = item.desc.replace(regExp, str)
                }
            }

            this.hasMore=(res.data.length==this.pageSize)?true:false
            this.pageNum = this.pageNum + 1

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
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.hasMore){
      let key = this.data.key
      if(!util.isEmpty(key)){
        this.loadArticleByKey(key)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})