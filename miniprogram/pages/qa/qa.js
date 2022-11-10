// pages/qa/qa.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAnswerFlag:false,
    ckValues:[],
    rightAnswers:[],

    curIndex:0,
    curQuestions:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    let cid = parseInt(options.cid)
    let id = options.id
    if(cid && id){
      this.setData({
        cid:cid,
        id:id
      })
      this.setNavTitle(cid)
      this.loadQuestion(id)
    }
    
  },

  //阅读量++
  incRead: function(id){
    wx.cloud.callFunction({
      name: "quickFunctions",
      data: {
        type: "incQuestion",
        id: id
      }
    })
  },

  //加载题目
  loadQuestion:function(id){
    wx.showLoading({
        title: '数据加载中',
    })

    let qaDoc = db.collection("question").doc(id);
    qaDoc.get({
        success: res => {
            this.setData({
              qaObj: res.data,
              curQuestions:[res.data]
            })
            this.incRead(this.data.qaObj._id)
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

  //上一题
  pre:function(){
    this.setData({
      showAnswerFlag:false
    })

    let curIndex = this.data.curIndex
    let curQuestions = this.data.curQuestions

    //到最后一条了
    if(curIndex == 0){
      wx.showLoading({
        title: '数据加载中',
      })

      //向前加载10条
      db.collection("question").where({
        subCategory: this.data.cid,
        time: _.gt(this.data.qaObj.time)
      }).orderBy("time", "asc").limit(10).get({
        success: res => {
          if (res.data.length > 0) {
            let curIndex = res.data.length - 1
            this.setData({
              curQuestions:res.data.reverse(),
              curIndex:curIndex,
              qaObj:res.data[curIndex]
            })
          }else{
            wx.showToast({
              title: '没有更多了',
            })
          }
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
    }else{
      curIndex--
      this.setData({
        curIndex:curIndex,
        qaObj:curQuestions[curIndex]
      })
    }
    //增加1
    this.incRead(this.data.qaObj._id)
  },

  //下一题
  next:function(){
    this.setData({
      showAnswerFlag:false
    })

    let curIndex = this.data.curIndex
    let curQuestions = this.data.curQuestions

    if(curIndex == curQuestions.length-1){
      wx.showLoading({
        title: '数据加载中',
      })
      
      //向前加载10条
      db.collection("question").where({
        subCategory: this.data.cid,
        time: _.lt(this.data.qaObj.time)
      }).orderBy("time", "desc").limit(10).get({
        success: res => {
          if (res.data.length > 0) {
            this.setData({
              curQuestions:res.data,
              curIndex:0,
              qaObj:res.data[0]
            })
          }else{
            wx.showToast({
              title: '没有更多了',
            })
          }
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
    }else{
      curIndex++
      this.setData({
        curIndex:curIndex,
        qaObj:curQuestions[curIndex]
      })
    }
    
    //增加1
    this.incRead(this.data.qaObj._id)
  },

  //checkbox 
  checkChange: function(e){
    let ckValues = e.detail.value
    ckValues.sort()//排序
    this.setData({
      ckValues: ckValues
    })
  },

  //radio 
  radioChange: function(e){
    this.setData({
      ckValues: [e.detail.value]
    })
  },

  //提交
  submitAnswer:function(e){
    let rightAnswers = []
    for(let item of this.data.qaObj.answers){
      if(item.ck == 1){
        rightAnswers.push(item.name)
      }
    }
    rightAnswers.sort()//排序
    
    if(this.data.ckValues.join("") == rightAnswers.join("")){
      wx.showToast({
        title: '回答正确',
        icon:"success"
      })
      return;
    }else{
      wx.showToast({
        title: '回答错误',
        icon:"error"
      })
    }
  },

  //显示答案
  showAnswer:function(e){
    this.setData({
      showAnswerFlag:!this.data.showAnswerFlag
    })
  },

  //打开链接
  openLink: function(e){
    let link = e.currentTarget.dataset.link
    wx.navigateTo({
      url: '/pages/webview/webview?url='+link,
    })
  },

  //打开视频
  openVideo: function (e) {
    let fname = e.currentTarget.dataset.fname
    let vid = e.currentTarget.dataset.vid
    wx.openChannelsActivity({
        finderUserName: fname,
        feedId: vid
    })
  },

  //复制链接
  copyDownload: function (e) {
    wx.setClipboardData({
        data: e.currentTarget.dataset.download
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }

})