const util = require("../../utils/util")
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAnswerFlag:false,
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
    this.loadQuestions()
  },

  //加载20个题目
  loadQuestions:function(){
    wx.showLoading({
      title: '数据加载中...',
    })

    let sortField = ["_id","time","level"]
    let sIndex = util.rand(0, sortField.length-1)
    let direction = ["asc","desc"]
    let dIndex = util.rand(0, direction.length-1)
    let count = [10,15,20]
    let cIndex = util.rand(0, count.length-1)

    //随机数
    let start = util.rand(0, 8)
    
    db.collection("question").where({
      type: _.gt(1)
    }).orderBy(sortField[sIndex], direction[dIndex]).skip(start).limit(count[cIndex]).get({
        success: res => {
          if(res.data.length > 0){
            this.setData({
              curIndex: 0,
              qaObj: res.data[0],
              curQuestions: res.data
            })
            //自增
            this.incRead(res.data[0]._id)
            //设置标题
            this.setNavTitle()
          }
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

  //上一题
  pre:function(){
    let curIndex = this.data.curIndex
    let curQuestions = this.data.curQuestions

    //到最后一条了
    if(curIndex == 0){
      wx.showToast({
        title: '没有更多了',
      })
    }else{
      curIndex--
      this.setData({
        curIndex:curIndex,
        qaObj:curQuestions[curIndex]
      })

      //自增
      this.incRead(this.data.qaObj._id)
    }

    this.setData({
      showAnswerSubmit:false
    })
  },

  //下一题
  next:function(){
    let curIndex = this.data.curIndex
    let curQuestions = this.data.curQuestions

    if(curIndex == curQuestions.length-1){
      wx.showToast({
        title: '没有更多了',
      })
    }else{
      curIndex++
      this.setData({
        curIndex:curIndex,
        qaObj:curQuestions[curIndex]
      })

      //自增
      this.incRead(this.data.qaObj._id)

      //显示提交按钮
      if(curIndex == curQuestions.length-1){
        this.setData({
          showAnswerSubmit:true
        })
      }
    }
  },

  //checkbox 
  checkChange: function(e){
    let ckValues = e.detail.value
    ckValues.sort()//排序
    this.prepareCkValues(ckValues)
  },

  //radio 
  radioChange: function(e){
    let ckValues = [e.detail.value]
    this.prepareCkValues(ckValues)
  },

  //选择答案
  prepareCkValues:function(ckValues){
    for(let item of this.data.qaObj.answers){
      if(util.contain(ckValues, item.name)){
        item.uck = true
      }else{
        item.uck = false
      }
    }
  },

  //再来一次
  replay:function(e){
    wx.showModal({
      title: '提示',
      content: '确定重新模拟面试？',
      success: res => {
        if (res.confirm) {
          this.setData({
            showAnswerFlag:false,
            showAnswerSubmit:false,
            curIndex:0,
            curQuestions:[]
          })
          this.loadQuestions()
        }
      }
    })
  },

  //提交
  submitAnswer:function(e){
    wx.showModal({
      title: '确定要提交吗？',
      content: '提交完成，即可看到答题结果',
      success: res => {
        if (res.confirm) {
          this._doSubmitAnswer()
        }
      }
    })
  },

  _doSubmitAnswer:function(){
    let rightCount = 0
    let curQuestions = this.data.curQuestions
    for(let item of curQuestions){
      let cks = []
      let ucks = []
      for(let a of item.answers){
        if(a.uck){
          ucks.push(a.name)
        }
        if(a.ck == 1){
          cks.push(a.name)
        }
      }
      item.cks = cks.sort().join(" , ")
      item.ucks = ucks.sort().join(" , ")

      //正确+1
      if(item.cks == item.ucks){
        rightCount++
        item.right = 1 //答对
      }
    }

    this.setData({
      curQuestions: curQuestions,
      showAnswerFlag: true,
      rightCount:rightCount,
      qaObj:this.data.qaObj,
      showAnswerSubmit:false
    })

    let result = "你总共答对 "+rightCount+"/"+ curQuestions.length +" 道题"
    this.setData({
      result:result
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
  setNavTitle:function(){
    wx.setNavigationBarTitle({
      title: "模拟面试 "+this.data.curQuestions.length+" 题"
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }

})

