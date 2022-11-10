const db = wx.cloud.database()
const app = getApp()
let util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    subCategoryArray:app.getQuestionTypes(),
    subCategory:1,
    subCategoryName:"Java",

    levelArray:[
      {name:"初级",id:1},
      {name:"中级",id:2},
      {name:"高级",id:3},
    ],
    level:1,
    levelName:"初级",

    typeArray:[
      {name:"问答题",id:1},
      {name:"单选题",id:2},
      {name:"多选题",id:3},
    ],
    type:1,
    typeName:"问答题",

    recommendArray:[
      {name:"否",id:0},
      {name:"是",id:1}
    ],
    recommend:0,
    recommendName:"否",
    
  },

  onLoad: function(options){
    this.setData({
      questionId:options.id
    })
    db.collection("question").doc(options.id).get({
      success:res=>{
        let question = res.data
        this.setData({
          question: question,
          questionImg: question.img,

          subCategory:question.subCategory,
          subCategoryName:question.subCategoryName,
          level:question.level,
          levelName:question.levelName,
          type:question.type,
          typeName:question.typeName,
          recommend:question.recommend,
          recommendName:question.recommendName,

          answers:question.answers
        })
      }
    })
  },

  //修改分类
  changeSubCategory:function(e){
    let item = this.data.subCategoryArray[e.detail.value];
    this.setData({
      subCategory: item.id,
      subCategoryName: item.name
    })
  },

  //修改级别
  changeLevel:function(e){
    let item = this.data.levelArray[e.detail.value];
    this.setData({
      level: item.id,
      levelName: item.name
    })
  },

  //修改题型
  changeType:function(e){
    let item = this.data.typeArray[e.detail.value];
    this.setData({
      type: item.id,
      typeName: item.name
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

  //checkbox 
  ckChange: function(e){
    let values = e.detail.value
    for(let item of this.data.answers){
      if(util.contain(values, item.name)){
        item.ck = 1
      }else{
        item.ck = 0
      }
    }
  },

  //form表单提交
  submitForm: function (e) {
    let question = e.detail.value

    //先做一些校验，再发起提交
    if(util.isEmpty(question.title)){
      wx.showToast({
        title: '标题不能为空',
      })
      return
    }

    wx.showLoading({
      title: "更新中..."
    })

    for(let item of this.data.answers){
      item.value = question[item.name].trim()
      delete question[item.name]
    }
    question.answers = this.data.answers
    this.createCloudQuestion(question)
  },

  //创建博客到云数据库
  createCloudQuestion: function (question) {
    question.id = this.data.questionId

    question.subCategory = this.data.subCategory
    question.subCategoryName = this.data.subCategoryName
    question.level = this.data.level
    question.levelName = this.data.levelName
    question.type = this.data.type
    question.typeName = this.data.typeName
    question.recommend = this.data.recommend
    question.recommendName = this.data.recommendName
    
    question.title = question.title.trim()
    question.desc = question.desc.trim()
    question.link = question.link.trim()
    question.download = question.download.trim()
    question.finderUserName = question.finderUserName.trim()
    question.videoId = question.videoId.trim()
    
    //添加博客到云平台数据库中
    wx.cloud.callFunction({
      name: "questionFunctions",
      data: {
        type: "updateQuestion",
        question: question
      },
      success: res => {
        wx.showToast({
          title: '更新成功',
        })
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
        wx.hideLoading() //不严谨
      }
    })

  }


})