const util = require("../../utils/util.js");

// index.js
const db = wx.cloud.database()

Page({
  
  data: {
    category:[
      {image:"source.png",name:"编程资料",id:1},
      {image:"soft.png",name:"源码下载",id:2},
      {image:"test.png",name:"面试题库",id:3},
      {image:"article.png",name:"专栏文章",id:4}
    ],
    banners:[],
    promps:[],
    curIndex:0
  },
  
  onLoad: function(e){
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })

    //加载推荐
    this.loadBanners()

    //加载每日一题
    this.loadQuestion()

    //更新访问人数
    this.incSiteAv()
    
  },

  //加载推荐的banners
  loadBanners:function(e){
    wx.showLoading({
      title: '数据加载中',
    })
    db.collection("article").where({
      recommend: 1
    }).field({
      title: true,
      link: true,
      img: true
    }).orderBy("time", "desc").limit(3).get({
      success: res => {
        this.setData({
            banners: res.data
        })
      },
      complete: res => {
        //wx.hideLoading()
      },
      fail: res => {
        wx.showToast({
          title: '获取失败',
        })
        wx.hideLoading()
      }
    })
  },

  //加载每日一题
  loadQuestion:function(){
    wx.showLoading({
      title: '数据加载中',
    })

    db.collection("question").where({
      recommend: 1
    }).field({
      title: true,
      levelName:true,
      subCategory:true,
      read:true
    }).orderBy("time", "desc").limit(4).get({
      success: res => {
        //随机取一条
        let array = res.data
        let index = util.rand(0, array.length-1)
        this.setData({
          question: array[index]
        })
      },
      complete: res => {
        //wx.hideLoading()
      },
      fail: res => {
        wx.showToast({
          title: '获取失败',
        })
        wx.hideLoading()
      }
    })
  },

  //访问量++
  incSiteAv: function(){
    wx.cloud.callFunction({
      name: "quickFunctions",
      data: {
        type: "incSiteAv"
      },
      success:res=>{
        //console.log("res = ", res);
        this.setData({
          site:res.result.data
        })
      }
    })
  },

  loadimg:function(e){
    wx.hideLoading()
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

  //菜单导航
  navigator :function(e){
    let id = e.currentTarget.dataset.id;
    //console.log("id = " + id);
    let url = null
    if(id == 1){
      url = "/pages/resource/resource"
    }else if(id == 2){
      url = "/pages/download/download"
    }else if(id == 3){
      url = "/pages/qaindex/qaindex"
    }else if(id == 4){
      url = "/pages/archived/archived"
    }
    if(url){
      wx.navigateTo({
        url: url,
      })
    }
  },

  //检索
  doSearch:function(e){
    let key = e.detail.value.key
    if(util.isEmpty(key)){
        wx.showToast({
          title: '请输入关键字',
        })
    }else{
        wx.navigateTo({
            url: '/pages/search/search?key='+key,
        })
    }
  }
  
});

