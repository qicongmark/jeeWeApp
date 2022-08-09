
const app = getApp()
const CloudRequest = require('../../util/CloudRquest.js')
const db = wx.cloud.database()

Page({

  data: {

  },

  onLoad: function (e) {

    //加载云数据库中的数据
    db.collection("article").orderBy("time", "desc").get({
      success: res => {
        this.setData({
          articles: res.data
        })
      }
    })

  },

  //删除博客
  removeBlog: function (e) {
    let id = e.currentTarget.dataset.id

    wx.cloud.callFunction({
      name: "blogFunctions",
      data: {
        type: "removeBlog",
        id: id
      },
      success: res => {
        console.log(res);
        wx.showToast({
          title: '删除成功',
        })
        let article = this.data.article
        for (let i in article) {
          if (article[i]._id == id) {
            article.splice(i, 1)
            break;
          }
        }
        this.setData({
          article: article
        })
      }
    })
  }


});