// pages/index/index.js
let util = require("../../utils/util.js");
var app = getApp();
const db = wx.cloud.database();

Page({

  //分页
  pageNum:1,
  pageSize:20,
  hasMore:true,

  /**
   * 页面的初始数据
   */
  data: {
    curId:0,
    articles:[],
    itemList:[{name:"所有",id:0}].concat(app.getSubCategory())
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    //默认加载第一类
    this.loadArticle() 
  },

  //加载资源
  loadArticle: function () {
    wx.showLoading({
      title: '数据加载中',
    })

    let query = db.collection("article")
    if (this.data.curId) {
      query = query.where({
        subCategory: parseInt(this.data.curId)
      })
    }
    
    query = query.where({
      category: 1
    }).field({
      title: true,
      link: true,
      desc: true,
      img: true
    })

    if(this.data.curId){
      query = query.orderBy("status", "desc").orderBy("time", "desc")
    }else{
      query = query.orderBy("time", "desc")
    }
    
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
      fail: res=>{
        wx.showToast({
          title: '获取失败',
        })
      }
    })
  },

  changeItem: function (e) {
    let id = e.target.dataset.id
    this.setData({
      curId: id,
      articles:[]
    })

    //重置
    this.pageNum = 1
    this.hasMore = true
    //加载数据
    this.loadArticle()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrollToLower() {
    if(this.hasMore){
      this.loadArticle()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
  }

})
