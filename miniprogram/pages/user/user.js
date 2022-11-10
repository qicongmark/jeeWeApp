// pages/user/user.js
const app = getApp()

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
  },

  toMy:function(e){
    wx.showToast({
      title: '功能开发中...',
    })
  },

  /**
   * 管理页面
   */
  toManage: function(e){
    wx.showLoading({
      title: "登录校验中..."
    })

    wx.cloud.callFunction({
      name: "userFunctions",
      data: {
        type: "getOpenId"
      },
      success: res => {
        if(res.result.token){
          wx.navigateTo({
            url: '/pages/manage/articleManage/articleManage',
          })
        }else{
          wx.showToast({
            title: '登录失败',
            icon: "error"
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: '登录失败',
          icon: "error"
        })
      },
      complete: res => {
        wx.hideLoading() 
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