
## jeeWeApp

项目名jee，源自于网站 https://jeeweixin.com ，WeApp，表示微信小程序。

这是一个云开发小程序的源码。

不需要后端编程、服务器、域名，就可以完成数据、图片的存储、修改、动态管理、授权等。


### 使用方法

- 1、开发者已经注册了正式版小程序。注册网址 https://mp.weixin.qq.com，并到后台拿到`appid`

- 2、小程序开发工具导入此源码，导入的时候，修改`appid`

- 3、点击开发工具上方的“云开发”，会自动开通云空间。复制云空间id。

- 4、修改 `envList.js` 中的 `envId`，改成开发者的云空间id

- 5、上传`cloudfunctions`中的云函数（右键上传即可）

- 6、在云空间中，创建数据库集合 `article` 等，并修改权限为：`所有用户可读，仅创建者可读写`。

- 7、在云空间中，数据的集合分别导入doc目录中的对应集合的数据

- 8、重新编译小程序即可，看到效果


详细的视频教程，去下方公众号获取


### 我的公众号

也可以关注我的公众号`祁大聪`，回复`jeeWeApp`交流。

![qidacong](https://raw.githubusercontent.com/qicongmark/blob-img/master/20220426/qidacong.6kvorztse8k0.webp)


