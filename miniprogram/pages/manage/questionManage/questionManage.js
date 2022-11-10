// pages/manage/questionManage/questionManage.js
let util = require("../../../utils/util.js")
const db = wx.cloud.database()

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
    //加载云数据库中的数据
    this.loadQuestion()
    
  },

  //刷新
  loadQuestion: function(key){
    wx.showLoading()

    let doc = db.collection("question").field({
      title: true,
      subCategoryName:true,
      levelName:true,
      typeName:true
    })

    if(key && !util.isEmpty(key)){
      doc = doc.where({
        title: db.RegExp({
          regexp: key,
          options: 'i'
        })
      })
    }

    //加载20条
    doc.orderBy("time", "desc").get({
      success: res => {
        this.setData({
          questions: res.data
        })
      },
      complete: res => wx.hideLoading()
    })

  },

  //搜索
  doSearch:function(e){
    let key = e.detail.value.key
    this.loadQuestion(key.trim())
  },

  //添加文章
  addQuestion: function (e) {
    wx.navigateTo({
      url: '/pages/manage/questionAdd/questionAdd',
    })
  },

  //修改文章
  editQuestion: function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/manage/questionEdit/questionEdit?id='+id,
    })
  },

  //删除面试题
  deleteQuestion: function (e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          })
          wx.cloud.callFunction({
            name: "questionFunctions",
            data: {
              type: "deleteQuestion",
              id: id
            },
            success: res => {
              let questions = this.data.questions
              for (let i in questions) {
                if (questions[i]._id == id) {
                  questions.splice(i, 1)
                  break;
                }
              }
              this.setData({
                questions: questions
              })
            },
            complete:res=>{
              wx.hideLoading()
            }
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})