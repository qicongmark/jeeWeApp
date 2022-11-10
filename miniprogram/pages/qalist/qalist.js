// pages/qa/qa.js
const app = getApp()
const db = wx.cloud.database()

Page({

  //分页
  pageNum:1,
  pageSize:20,
  hasMore:true,

  /**
   * 页面的初始数据
   */
  data: {
    questionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    let cid = options.id
    if(cid){
      cid = parseInt(cid)
      
      //设置标题
      this.setNavTitle(cid)
      //加载数据
      this.loadQuestions(cid)
      
      this.setData({
        cid: cid
      })
    }

    //答题量++
    this.incSiteQa()
  },

  //访问量++
  incSiteQa: function(){
    wx.cloud.callFunction({
      name: "quickFunctions",
      data: {
        type: "incSiteQa"
      }
    })
  },
  
  //设置标题
  setNavTitle:function(cid){
    let types = app.getQuestionTypes()
    for(let item of types){
      if(item.id == cid){
        wx.setNavigationBarTitle({
          title: item.name
        })
        break;
      }
    }
  },

  loadQuestions:function(cid){
    wx.showLoading({
      title: '数据加载中',
    })

    let query = db.collection("question").where({
      subCategory: cid
    }).field({
      title: true,
      read: true,
      levelName: true,
      typeName: true
    })

    query = query.orderBy("time", "desc").skip((this.pageNum-1)*this.pageSize).limit(this.pageSize)
    query.get({
      success: res => {
        //console.log(res.data)
        this.hasMore=(res.data.length==this.pageSize)?true:false
        this.pageNum=this.pageNum + 1

        let questionList = this.data.questionList
        questionList = questionList.concat(res.data)
        this.setData({
          questionList: questionList
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.hasMore){
      this.loadQuestions(this.data.cid)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})