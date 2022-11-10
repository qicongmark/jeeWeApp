const db = wx.cloud.database()
const app = getApp()
let util = require("../../../utils/util.js");

Page({

  firstImage:null,

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
    statusName:"发布",

    userInfo: {
      avatar: "../../images/icon/20.png",
      name: ""
    }
  },

  //授权获取用户信息
  onGetUserProfile: function (e) {
    wx.getUserProfile({
      desc: '请授权头像和昵称的信息',
      success: res => {
        //console.log(res);
        let userInfo = this.data.userInfo
        userInfo.avatar = res.userInfo.avatarUrl
        userInfo.name = res.userInfo.nickName
        this.setData({
          userInfo: userInfo
        })
      }
    })
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
            //第一个上传的图片
            if(that.firstImage == null){
              that.firstImage = cloudRes.fileID
            }

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
    //console.log(article);
    //先做一些校验，再发起提交
    if(util.isEmpty(article.title)){
      wx.showToast({
        title: '标题不能为空',
      })
      return
    }

    //提交数据
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
          //默认使用富文本内容的第一个图片
          if(this.firstImage){
            article.img = this.firstImage
          }else{
            article.img = ""
          }
          //创建到云数据库
          this.createCloudArticle(article)
        }

      }
    })
  },

  //创建博客到云数据库
  createCloudArticle: function (article) {
    article.time = new Date().getTime()
    article.category = this.data.category
    article.categoryName = this.data.categoryName
    article.subCategory = this.data.subCategory
    article.subCategoryName = this.data.subCategoryName
    article.recommend = this.data.recommend
    article.recommendName = this.data.recommendName
    article.status = this.data.status
    article.statusName = this.data.statusName
    article.read = 105 + util.rand(10,50) //阅读量
    article.like = 0 //喜欢量

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
        type: "addArticle",
        article: article
      },
      success: res => {
        wx.showToast({
          title: '添加成功',
        })
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
        wx.hideLoading() //不严谨
      }
    })

  },

  //富文本编辑器准备好了
  onEditorReady: function (e) {
    wx.createSelectorQuery().select("#contentEditor").context(res => {
      this.editorContext = res.context
    }).exec()
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