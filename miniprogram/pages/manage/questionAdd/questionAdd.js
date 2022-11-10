const app = getApp()
let util = require("../../../utils/util.js");

Page({

  firstImage:null,

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

    answers:[
      {name:'A',ck:0,value:""},
      {name:'B',ck:0,value:""},
      {name:'C',ck:0,value:""},
      {name:'D',ck:0,value:""}
    ]
    
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

    for(let item of this.data.answers){
      item.value = question[item.name].trim()
      delete question[item.name]
    }
    question.answers = this.data.answers
    this.createCloudQuestion(question)
  },

  //创建博客到云数据库
  createCloudQuestion: function (question) {
    //提交数据
    wx.showLoading({
      title: "数据加载中..."
    })

    question.time = new Date().getTime()
    question.subCategory = this.data.subCategory
    question.subCategoryName = this.data.subCategoryName
    question.level = this.data.level
    question.levelName = this.data.levelName
    question.type = this.data.type
    question.typeName = this.data.typeName
    question.recommend = this.data.recommend
    question.recommendName = this.data.recommendName
    question.read = 105 + util.rand(10,50) //阅读量
    question.like = 0 //喜欢量

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
        type: "addQuestion",
        question: question
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


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }


})