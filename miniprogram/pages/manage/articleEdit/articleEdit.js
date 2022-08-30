const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onLoad: function(options){
    db.collection("article").doc(options.id).get({
      success:res=>{
        let article = res.data
        this.setData({
          article: article,
          articleImg: article.img
        })
        this.editorContext.setContents({html:article.content})
      }
    })
  },

  //富文本编辑器准备好了
  onEditorReady: function (e) {
    wx.createSelectorQuery().select("#contentEditor").context(res => {
      this.editorContext = res.context
    }).exec()
  },

  insertImage: function (e) {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {

        //上传到云平台
        let imgFile = res.tempFilePaths[0]
        let filename = imgFile.substring(imgFile.lastIndexOf("."));
        filename = new Date().getTime() + filename

        wx.showLoading({
          title: '图片上传中',
        })

        wx.cloud.uploadFile({
          filePath: res.tempFilePaths[0],
          cloudPath: filename,
          success: cloudRes => {
            that.editorContext.insertImage({
              src: cloudRes.fileID, //可以换成云函数的 fileid
              data: {
                id: filename
              },
              width: '100%'
            })
          },
          fail: console.error,
          complete: res=>{
            wx.hideLoading();
          }
        })
      }
    })
  },

  //form表单提交
  submitArticle: function (e) {

    let article = e.detail.value

    //先做一些校验，再发起提交
    //todo

    wx.showLoading({
      title: "数据加载中..."
    })

    //获取富文本编辑器里的内容
    this.editorContext.getContents({
      success: res => {
        article.content = res.html

        //上传图片
        if (this.data.articleImg) {
          let articleImg = this.data.articleImg
          let filename = articleImg.substring(articleImg.lastIndexOf("."))
          filename = new Date().getTime() + filename

          wx.cloud.uploadFile({
            cloudPath: filename,
            filePath: this.data.articleImg,
            success: res => {
              article.img = res.fileID
              this.createCloudArticle(article)
            },
            fail: console.error
          })

        } else {
          //创建到云数据库
          this.createCloudArticle(article)
        }

        // this.setData({
        //   article:article
        // })
      }
    })
  },

  //创建博客到云数据库
  createCloudArticle: function (article) {
    article.time = new Date().getTime()

    //添加博客到云平台数据库中
    wx.cloud.callFunction({
      name: "articleFunctions",
      data: {
        type: "addArticle",
        article: article
      },
      success: res => {
        wx.showToast({
          title: '添加成功',
        })
        console.log(res);
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
        wx.hideLoading() //不严谨
      }
    })

  },

  //富文本处理
  format: function (e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    this.editorContext.format(name, value)
  },

  //选择本地图片
  chooseArticleImage: function (e) {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          articleImg: res.tempFilePaths[0]
        })
      }
    })
  },

  //移除图片
  removeArticleImage: function (e) {
    this.setData({
      articleImg: null
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }


})