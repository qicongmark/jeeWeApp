// index.js
// const app = getApp()
const { envList } = require('../../envList.js');
const CloudRequest = require('../../util/CloudRquest.js')
const db = wx.cloud.database()

Page({
  data: {
    banners:[],
    category:[
      {image:"source.png",name:"免费资源",code:1000,path:"/pages/srcs/srcs"},
      {image:"soft.png",name:"学习编程",code:1001,path:"/pages/srcs/srcs"},
      {image:"srcs.png",name:"源码下载",code:1002,path:"/pages/srcs/srcs"},
      {image:"test.png",name:"大厂面试",code:1003,path:"/pages/srcs/srcs"}
    ],
    /**
    promps:[
      {
        title:"视频教程",
        array:[
          {cover:"../../images/s.png",name:"Java视频教程",path:""},
          {cover:"../../images/s.png",name:"Python视频教程",path:""}
        ]
      },
      {
        title:"编程路线图",
        array:[
        {cover:"../../images/s.png",name:"Java路线图",path:""},
        {cover:"../../images/s.png",name:"Python路线图",path:""}
        ]
      },
      {
        title:"热门电子书",
        array:[
        {cover:"../../images/s.png",name:"Java电子书",path:""},
        {cover:"../../images/s.png",name:"Python电子书",path:""}
        ]
      }
    ], */
    
    promps:[],
    curIndex:0

  },

  onLoad: function(e){
    let fileid = 'cloud://moban-0adc39.6d6f-moban-0adc39-1258743806/index.json'
    CloudRequest.requestJson(fileid,jsonRes=>{
      console.log(jsonRes);
      this.setData({
        banners:jsonRes.data.banners,
        promps:jsonRes.data.promps,
      })

      //处理分类内容
      this.setData({
        curPromp:this.data.promps[0]
      })
    })

    //加载云数据库中的数据
    db.collection("blogs").orderBy("time","desc").get({
      success:res=>{
        //console.log(res)
        
        // let blog = res.data[0]
        // blog.brief = blog.brief.replace(/\\n/g, "\n") 
        
        this.setData({
          blogs:res.data
        })
      }
    })
    
  },

  //删除博客
  removeBlog:function(e){
    let id = e.currentTarget.dataset.id
    /**
    db.collection("blogs").doc(id).remove({
      success:res=>{
        console.log(res);
      },
      fail:console.error
    }) */
    wx.cloud.callFunction({
      name:"blogFunctions",
      data:{
        type:"removeBlog",
        id:id
      },
      success:res=>{
        console.log(res);
        wx.showToast({
          title: '删除成功',
        })
        let blogs = this.data.blogs
        for(let i in blogs){
          if(blogs[i]._id == id){
            blogs.splice(i,1)
            break;
          }
        }
        this.setData({
          blogs:blogs
        })
      }
    })
  },
  
  changePromp: function(e){
    let index = 0
    index = e.currentTarget.dataset.index
    this.setData({
      curPromp:this.data.promps[index],
      curIndex:index
    })
  },

  //跳转
  toNavigator: function(e){
    let code = e.currentTarget.dataset.code
    let type = e.currentTarget.dataset.type
    let img = e.currentTarget.dataset.img
    let pdf = e.currentTarget.dataset.pdf

    if(type == "video"){
      wx.navigateTo({
        url: '/pages/course/course?code='+code,
      })
    }else if(type == "image"){
      //预览图片
      wx.previewImage({
        current: img,
        urls: [img]
      })
    }else if(type == "pdf"){
      //打开PDF
      wx.cloud.downloadFile({
        fileID:pdf,
        success:res=>{
          if(res.statusCode == 200){
            wx.openDocument({
              filePath: res.tempFilePath,
            })
          }
        }
      })
    }

  }

});
