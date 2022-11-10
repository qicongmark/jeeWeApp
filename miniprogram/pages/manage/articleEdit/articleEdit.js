const db = wx.cloud.database()
const app = getApp()
let util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    categoryArray:[
      {name:"编程资料",id:1},
      {name:"源码下载",id:2},
      {name:"推荐文章",id:3},
      {name:"面试题库",id:4}
    ],
    category:1,
    categoryName:"编程资料",

    //二级分类
    subCategoryArray:app.getSubCategory(),
    subCategory:1,
    subCategoryName:"Java",
    
    recommendArray:[
      {name:"否",id:0},
      {name:"是",id:1}
    ],
    recommend:0,
    recommendName:"否",
    
    statusArray:[
      {name:"发布",id:1},
      {name:"置顶",id:2}
    ],
    status:1,
    statusName:"发布"
    
  },

  onLoad: function(options){
    this.setData({
      articleId:options.id
    })
    db.collection("article").doc(options.id).get({
      success:res=>{
        let article = res.data
        this.setData({
          article: article,
          articleImg: article.img,

          category:article.category,
          categoryName:article.categoryName,
          subCategory:article.subCategory,
          subCategoryName:article.subCategoryName,
          recommend:article.recommend,
          recommendName:article.recommendName,
          status:article.status,
          statusName:article.statusName
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

  //修改分类
  changeCategory:function(e){
    let item = this.data.categoryArray[e.detail.value];
    this.setData({
      category: item.id,
      categoryName: item.name
    })
  },

  //修改二级分类
  changeSubCategory:function(e){
    let item = this.data.subCategoryArray[e.detail.value];
    this.setData({
      subCategory: item.id,
      subCategoryName: item.name
    })
  },

  //修改状态
  changeStatus:function(e){
    let item = this.data.statusArray[e.detail.value];
    this.setData({
      status: item.id,
      statusName: item.name
    })
  },

  //是否推荐
  changeRecommend:function(e){
    let item = this.data.recommendArray[e.detail.value];
    this.setData({
      recommend: item.id,
      recommendName: item.name
    })
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
    if(util.isEmpty(article.title)){
      wx.showToast({
        title: '标题不能为空',
      })
      return
    }

    wx.showLoading({
      title: "更新中..."
    })

    //获取富文本编辑器里的内容
    this.editorContext.getContents({
      success: res => {
        article.content = res.html

        //重新上传了图片才更新
        if (this.data.articleImg != this.data.article.img) {
          let articleImg = this.data.articleImg
          let filename = articleImg.substring(articleImg.lastIndexOf("."))
          filename = new Date().getTime() + filename

          wx.cloud.uploadFile({
            cloudPath: filename,
            filePath: this.data.articleImg,
            success: res => {
              article.img = res.fileID
              this.updateCloudArticle(article)
            },
            fail: console.error
          })

        } else {
          //更新到云数据库(article是新对象)
          article.img = this.data.articleImg
          this.updateCloudArticle(article)
        }

      }
    })
  },

  //创建博客到云数据库
  updateCloudArticle: function (article) {
    article.id = this.data.articleId
    article.category = this.data.category
    article.categoryName = this.data.categoryName
    article.subCategory = this.data.subCategory
    article.subCategoryName = this.data.subCategoryName
    article.recommend = this.data.recommend
    article.recommendName = this.data.recommendName
    article.status = this.data.status
    article.statusName = this.data.statusName

    article.title = article.title.trim()
    article.desc = article.desc.trim()
    article.link = article.link.trim()
    article.download = article.download.trim()
    article.pdf = article.pdf.trim()
    article.finderUserName = article.finderUserName.trim()
    article.videoId = article.videoId.trim()

    //添加博客到云平台数据库中
    wx.cloud.callFunction({
      name: "articleFunctions",
      data: {
        type: "updateArticle",
        article: article
      },
      success: res => {
        wx.showToast({
          title: '更新成功',
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