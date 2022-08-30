// pages/manage/articleManage/articleManage.js
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
    wx.showLoading()
    db.collection("article").orderBy("time", "desc").get({
      success: res => {
        this.setData({
          articles: res.data
        })
      },
      complete: res => wx.hideLoading()
    })
  },

  //添加文章
  addArticle: function (e) {
    wx.navigateTo({
      url: '/pages/manage/articleAdd/articleAdd',
    })
  },

  //修改文章
  editArticle: function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/manage/articleEdit/articleEdit?id='+id,
    })
  },

  //删除文章
  deleteArticle: function (e) {
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
            name: "articleFunctions",
            data: {
              type: "deleteArticle",
              id: id
            },
            success: res => {
              let articles = this.data.articles
              for (let i in articles) {
                if (articles[i]._id == id) {
                  articles.splice(i, 1)
                  break;
                }
              }
              this.setData({
                articles: articles
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