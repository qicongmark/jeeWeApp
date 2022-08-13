
## jeeWeApp

- 网站：https://jeeweixin.com


### 功能介绍

不需要后端编程、服务器、域名，就可以发布上线的小程序；

提供了小程序云存储的功能，可以自行替换图片、内容等；


### 使用方法

- 1、开发者已经注册了正式版小程序。注册网址 https://mp.weixin.qq.com，并到后台拿到appid

- 2、小程序开发工具导入此源码，导入的时候，修改appid

- 3、点击开发工具上方的“云开发”，会自动开通云空间。复制云空间id。

- 4、修改 envList.js 中的 envId，改成开发者的云空间id

- 5、上传cloudfunctions中的云函数（右键上传即可）

- 6、在云空间中，创建数据库集合 article 等，并修改权限为，所有用户可读仅创建者可写。

- 7、在云空间中，数据的集合分别导入doc目录中的对应集合的数据

- 8、重新编译小程序即可，看到效果

- 9、 使用方法的视频教程，去下方公众号获取

### 我的公众号

也可以关注我的公众号`祁大聪`，交流。

![qidacong](https://raw.githubusercontent.com/qicongmark/blob-img/master/20220426/qidacong.6kvorztse8k0.webp)


