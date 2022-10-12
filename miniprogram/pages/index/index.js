// index.js
// const app = getApp()
const { envList } = require('../../envList.js');
const CloudRequest = require('../../utils/CloudRquest.js')
const db = wx.cloud.database()

Page({

  data: {
    banners:[
      {cover:"cloud://cloud1-9gpqtz2t48f59ac7.636c-cloud1-9gpqtz2t48f59ac7-1255805873/1661869755939.jpg"},
      {cover:"cloud://cloud1-9gpqtz2t48f59ac7.636c-cloud1-9gpqtz2t48f59ac7-1255805873/1661868971320.jpg"},
      {cover:"cloud://cloud1-9gpqtz2t48f59ac7.636c-cloud1-9gpqtz2t48f59ac7-1255805873/1661869669785.jpg"}
    ],
    category:[
      {image:"source.png",name:"免费资源",code:1000,path:"/pages/srcs/srcs"},
      {image:"soft.png",name:"学习编程",code:1001,path:"/pages/srcs/srcs"},
      {image:"srcs.png",name:"源码下载",code:1002,path:"/pages/srcs/srcs"},
      {image:"test.png",name:"大厂面试",code:1003,path:"/pages/srcs/srcs"}
    ],
    promps:[],
    curIndex:0
  },


  onLoad: function(e){

  }

});

