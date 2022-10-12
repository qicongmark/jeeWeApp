const app = getApp();

function requestJson(url,cb,data){
  
  wx.showLoading({
    title: '数据加载中',
  })

  url = app.getUri(url,true),
  wx.request({
    url: url,
    dataType:"json",
    data: data,
    success: function (res) {
      if (typeof cb === "function") {
        cb(res);
      }
    },
    fail: function (res) {
      //console.log(res);
    },
    complete: function(){
      wx.hideLoading();
    }
  });
}

//export
module.exports = {
  requestJson: requestJson
}


